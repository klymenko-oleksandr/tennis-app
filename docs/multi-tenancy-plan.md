# Multi-Tenancy Migration Plan

> Status: Draft — not yet implemented. Referenced from DR.md §5.

## Why

`Court` and `Trainer` are currently global rows, and `User.role` is a single
flat `USER | ADMIN` flag (see `apps/api/src/auth/roles.guard.ts`). That's
enough for "one club, one set of admins," but not for "club A's admin
shouldn't be able to touch club B's courts, pricing, or bookings" once more
than one real club is onboarded. This document is the concrete plan for
introducing a `Club` (tenant) boundary before that becomes a real requirement,
so it isn't retrofitted under pressure later.

## Isolation strategy

Shared database, shared schema, `clubId` as a tenant discriminator column —
not database-per-tenant or schema-per-tenant. Simpler to build and query, at
the cost of needing discipline everywhere a query touches a tenant-scoped
table (a missed `clubId` filter is a cross-tenant data leak). Chosen because:

- DR.md §6 already commits to "not optimizing for scale" — a handful of
  clubs, not hundreds, is the realistic ceiling for this project.
- The alternative (schema/DB-per-tenant) is real ops overhead this project
  doesn't need yet, and cuts against the self-hosted-VPS-at-minimal-cost
  direction in DR.md §3.
- The main risk (a missed `clubId` filter) is addressed by pushing the filter
  into a small number of shared guard/service chokepoints rather than trusting
  every call site — see "Guard rework" below.

## Schema changes

```prisma
enum ClubRole {
  ADMIN
  STAFF
}

model Club {
  id        String   @id @default(uuid()) @db.Uuid
  name      String
  slug      String   @unique
  timezone  String   @default("Europe/Kyiv")
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  courts   Court[]
  trainers Trainer[]
  staff    ClubMembership[]

  @@map("clubs")
}

// Per-club staff role. Deliberately separate from the platform-level
// `User.role` (kept as a `USER | SUPERADMIN` flag for platform operations —
// creating clubs, promoting a club's first ADMIN — not day-to-day club
// management).
model ClubMembership {
  userId String   @db.Uuid
  clubId String   @db.Uuid
  role   ClubRole

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)
  club Club @relation(fields: [clubId], references: [id], onDelete: Cascade)

  @@id([userId, clubId])
  @@map("club_memberships")
}
```

- `Court.clubId` and `Trainer.clubId` — required `@db.Uuid`, `onDelete:
  Restrict` (a club shouldn't be deletable while it still has courts/trainers
  attached — force an explicit archive/reassign step instead of an implicit
  cascade).
- `Booking.clubId` — denormalized from `Booking.court.clubId`. Not strictly
  required for correctness (it's derivable via `Booking.court.clubId`), but
  #13's stats/analytics endpoints (see below) will otherwise need a join
  through `Court` on every aggregate query — worth the denormalization for
  query simplicity, backfilled at migration time and set alongside `courtId`
  on every future booking write.
- `Availability` is unchanged structurally — it already scopes to a specific
  `courtId`/`trainerId`, so club scoping is inherited transitively.
- `User.role` stays, repurposed: `Role { USER, SUPERADMIN }` instead of
  today's `USER | ADMIN`. A `SUPERADMIN` is a platform operator (you), not a
  club admin — club-level admin rights live in `ClubMembership` instead.

## Data migration steps

1. Add `clubId` as **nullable** on `Court`, `Trainer`, `Booking` (three
   separate migrations or one, either is fine — nullable-first avoids a
   not-null constraint failing against existing rows).
2. Data migration script (`prisma/migrations/.../migration.sql` or a
   one-off script like the existing `prisma/promote-admin.ts` pattern):
   create a single `Club` row representing the club this instance already
   serves, then backfill every existing `Court`/`Trainer`/`Booking` row with
   that club's id.
3. Alter `clubId` to `NOT NULL` + add the FK constraints, once backfilled.
4. Migrate every existing `User.role = 'ADMIN'` row into a `ClubMembership`
   row (`role: ADMIN`) for the same default club, then reset `User.role`
   to `USER` for everyone except whichever account should become the first
   `SUPERADMIN` (likely just the author's own account, promoted manually the
   same way `admin:promote` works today).

## Guard rework

- Today: `RolesGuard` + `@Roles(...)` checks `User.role` against a flat
  requirement. Keep this (rename to `PlatformRolesGuard` for clarity) for
  genuinely platform-level actions only — creating a `Club`, promoting a
  club's first `ADMIN`.
- New: `ClubRolesGuard` + `@ClubRoles(ClubRole.ADMIN)` decorator for
  day-to-day club admin endpoints (courts/trainers/bookings CRUD). It needs a
  `clubId` to check membership against; since today's admin routes are flat
  (`/courts/:id`, not `/clubs/:clubId/courts/:id`), the guard resolves it by
  loading the target `Court`/`Trainer` by id and reading `.clubId` before
  checking `ClubMembership` — one extra query per request, acceptable at this
  project's scale (DR.md §6), and avoids a route-prefix rewrite across every
  existing admin endpoint. Endpoints that *create* a new Court/Trainer (no
  existing row to resolve `clubId` from) take `clubId` explicitly in the
  request body instead, validated against the caller's `ClubMembership`.
- Every admin-facing service method (`CourtsService`, `TrainersService`,
  `BookingsService`'s admin list, and the future `#13` stats/pricing
  services) must take an explicit `clubId` and filter by it — no bare
  `findMany()` over a tenant-scoped table. This is the actual risk area (a
  missed filter is a cross-tenant leak); worth a lint rule or at least a
  consistent naming convention (`findManyForClub(clubId, ...)`) that makes a
  missing filter visually obvious in review.

## Interaction with #13 (pricing rules + stats)

- #13 is currently unscoped/unscheduled — good, because building `PricingRule`
  before `Club` exists would mean re-scoping it later. Land this plan's schema
  first, or at minimum give `PricingRule` a `clubId` column from its first
  migration even if enforcement isn't fully wired up yet.
- The stats/analytics half of #13 (`StatCard`/`OccupancyChart`/`RevenueChart`
  aggregate queries) is structurally unaffected by this plan — it just gains
  a required `WHERE clubId = ?` once `Club` exists, which `Booking.clubId`
  (see above) makes a direct filter rather than a join.
- Suggested sequencing: this plan → `#13` stats endpoints (now trivially
  club-scoped) → `#13` pricing rules (`PricingRule` modeled club-scoped from
  its first migration).

## Suggested issue breakdown

Each of these is its own issue → branch → PR, not one large change:

1. Schema: `Club`, `ClubMembership`, `clubId` on `Court`/`Trainer`/`Booking`
   + the backfill migration script.
2. `ClubRolesGuard` + `@ClubRoles()`, migrate existing admin endpoints off the
   flat `RolesGuard` (renamed `PlatformRolesGuard`) onto it.
3. Club CRUD (platform-level: create/rename a club, add/remove its admins),
   gated by `PlatformRolesGuard`.
4. Update `prisma/seed.ts` and `prisma/promote-admin.ts` for the club-scoped
   model.
5. Unblocked: `#13` stats endpoints, then `#13` pricing rules.

## Out of scope

- Billing/subscription per club — no signal this is needed yet.
- Cross-club discovery UX (a player browsing multiple clubs) — today's app is
  single-club-facing; worth its own design pass once real clubs exist,
  consistent with DR.md's "no real court integration yet" stance.
