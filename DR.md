# Design Review: Tennis Court Booking & Partner-Finding App

> Status: Draft v1 — living document, updated as decisions evolve.
> Working names considered: Squad, Dash (not finalized).

## 1. Goals

- **Project vector: Career/CV Showcase (Vector A)** — feature scope, stack choices, and testing rigor are prioritized by what demonstrates strong full-stack technical skill (the gap identified in a Lemon.io vetting rejection: recent hands-on backend/API/DB/full-stack ownership experience), rather than by pure user demand.
  - Constraint: the app must remain genuinely usable, not a fake/portfolio-only shell.
- **First real users:** the author and his wife — validate the full booking flow (court + trainer selection; payment undecided) end-to-end. Only after that works will a small group of tennis acquaintances be sought for testing (none currently lined up).
- **No hard deadline.** Paced alongside an active job search.
- **MVP scope:** courts and trainers are seeded/manually-entered data in the app's own DB — no live sync with any real court's booking system. Bookings in MVP are recorded only in the app's own DB.
- **Open architectural question — court integration:** real courts already run their own booking/availability systems and won't adopt something new/unproven. The data layer must be designed so the "source of truth" for availability can be swapped later without touching business logic (see §5, Availability Provider).
- **Competitive research:** there is a known iOS app with real booking functionality for the target court. Researching its behavior (e.g. via network traffic inspection) is in scope **only as design reference** for our own API/data model — not for direct, unauthorized integration. Any real integration requires the court's authorization.

## 2. Repositories and Libraries

- **Repo structure:** Nx monorepo — single repository, shared types/DTOs between frontend and backend, no need to publish an internal npm package.
- **Backend:** NestJS (TypeScript)
- **Frontend:** React (paired deliberately with NestJS to avoid an all-Angular-shaped stack and to track current market demand)
- **State management:** TanStack Query (React Query) for server state; built-in `useState`/`useContext` for local state. Zustand is a candidate to add later *if* additional local state complexity emerges — not adopted upfront.
- **ORM:** Prisma (with Prisma Studio useful for quick data inspection during development)
- **i18n:** `react-i18next` (see §7)

## 3. Hostings

- **Phased approach:**
  - **Phase 1:** Vercel (frontend) + Railway/Render (backend, deployed via Docker) — fast to stand up, minimal DevOps overhead while the app is still taking shape.
  - **Phase 2 (later):** migrate backend + DB to a self-hosted VPS (Hetzner/DigitalOcean, e.g. CX22/CX32-class instance, ~€7–12/month all-in including domain) running Docker Compose + nginx reverse proxy + Let's Encrypt SSL. Chosen for the DevOps/infra skill it demonstrates (a stronger CV signal than a one-click PaaS deploy) and because it doubles as its own CV story: "migrated from managed PaaS to self-hosted VPS without downtime."
- **Portability requirement:** Docker + 12-factor / env-based configuration from day one, so switching hosting providers is a config/DNS change, not a rewrite. Terraform for the VPS is a nice-to-have, not required for MVP.
- **Postgres:** self-hosted in Docker Compose from the start, regardless of hosting phase (not a managed DB service like Neon/Supabase Postgres) — keeps user data under our own infra.

## 4. Auth

- **Provider (Phase 1):** Supabase Auth (self-hostable GoTrue container against our own self-hosted Postgres — keeps data consistent with the self-hosted DB decision above), chosen as the path of least resistance. Migration cost is deliberately accepted as low given the tiny initial user base (2 people, then a handful).
- **Methods:** email/password **and Google OAuth (mandatory, not optional)**.
- **Why Google OAuth migrates cleanly:** Google remains the trust anchor regardless of which backend performs the OAuth handshake — our system only stores a `google_id → internal user_id` mapping. Moving to a custom auth backend later means re-implementing the OAuth exchange (e.g. `passport-google-oauth20`) and matching existing users by `google_id`/email; no password-reset burden, unlike email/password credentials (whose hashes aren't portable out of Supabase).
- **Future path (Phase 2, optional):** hybrid custom auth — NestJS + Passport + JWT (access/refresh tokens), using proven libraries (argon2/bcrypt) rather than hand-rolled cryptography, if/when full control becomes worth the migration effort.

## 5. DB and Persistence

- **Schema approach:** design a full ER schema upfront, covering both MVP entities (User, Court, Trainer, Booking, Availability) and planned post-MVP entities (Partner Matching, Payments) — even if some fields stay unused until those features ship. Chosen deliberately for system-design showcase value.
- **Availability Provider abstraction:** an interface separating "read/write availability & bookings" from *where that data actually lives*.
  - `InternalAvailabilityProvider` — reads/writes our own DB (MVP implementation).
  - `ExternalCourtAvailabilityProvider` — a future implementation that talks to a real court's system, once an integration agreement exists.
  - Business logic (booking, matching, notifications) depends only on the interface, never on a concrete implementation.
- **Time slots:** fixed-length slots, ~55–60 minutes (55 minutes preferred, to leave a 5-minute buffer for trainer changeover/ball collection between sessions). Implementation approach: model each slot as 55 minutes of actual bookable time with start times on a 60-minute cadence, rather than modeling the gap as a separate record.
- **Booking concurrency / conflict prevention:**
  - Use **separate, independent unique constraints per resource**, not one compound constraint across all resources:
    - `UNIQUE (court_id, time_slot)`
    - `UNIQUE (trainer_id, time_slot) WHERE trainer_id IS NOT NULL` (partial index, since a booking may have no trainer)
  - This ensures a taken court fails a booking attempt regardless of which trainer is requested, and vice versa — avoiding the false negative a single compound constraint would produce.
  - Both constraints are checked atomically within one transaction; a violation rolls back the whole booking and can be mapped to a specific, user-facing error ("court unavailable" vs. "trainer unavailable") based on which constraint fired.
  - Considered and explicitly rejected for current scale: distributed locking via Redis (system-design-interview-popular, but overkill for this user count) — documented here as a considered alternative.

## 6. Performance

- Not optimizing for scale at this stage (tiny expected concurrent user count).
- Baseline good practices applied from the start regardless: indexes on frequently-queried fields and foreign keys, pagination on list endpoints, DB connection pooling.
- Explicit anti-patterns to avoid from day one: N+1 queries, missing FK indexes.
- Load testing / horizontal scaling: deferred — would be premature optimization at this scale.

## 7. Localization

- **Ukrainian + English from the start**, using `react-i18next` (or equivalent) set up early rather than retrofitted.
- Real users (author, wife, future acquaintances) get Ukrainian; English is maintained so the app can be demoed to English-speaking recruiters without maintaining a separate build.

## 8. QA and Publishing

- **Testing strategy:** hybrid.
  - Full unit + integration test pyramid across the codebase (integration tests against a real test DB).
  - **Selective TDD** (red-green-refactor, vertical "tracer bullet" slices — one test → one implementation → repeat) specifically for booking concurrency logic, where behavior is complex and edge cases matter most.
  - E2E tests (e.g. Playwright/Cypress) for 1–2 critical flows (registration → booking), added once the UI stabilizes rather than from day one.
- **CI/CD:** GitHub Actions from the start — lint + tests on every PR, auto-deploy on push to `main` (targeting whichever hosting phase is active). A visible CI/lint/test status badge on the README from day one.

## 9. Security and Risks

Baseline requirements, confirmed mandatory for MVP:

- **PII hygiene:** never log passwords or tokens; all secrets via environment variables, never in code; HTTPS enforced from the MVP stage onward (even on Phase 1 PaaS hosting).
- **Rate limiting on auth endpoints** (e.g. `@nestjs/throttler`) to mitigate brute-force login attempts, even at a tiny user scale.
- **Authorization, not just authentication:** every booking-mutation endpoint must verify the acting user owns the resource being modified/cancelled (classic IDOR prevention) — "is logged in" is not sufficient.

**Other named risks:**
- Dependency on a future, currently nonexistent agreement with a real court for live availability integration (MVP intentionally does not depend on this).
- Competitive research on an existing booking app's network traffic is for design reference only; no direct/unauthorized integration with any third party's private API.

## 10. Estimates

- **Format:** milestone-based, **no calendar dates or week numbers** — deliberately, since there's no deadline and available time is unpredictable alongside an active job search.
- **Tracking tool:** GitHub Projects (issues + milestones) on a public repository.
- **Illustrative milestones** (to be refined once the repo/board exists):
  - **M1:** Auth working (Supabase Auth, email/password + Google OAuth)
  - **M2:** Booking flow works end-to-end (court + trainer selection, conflict-safe booking, self+wife can use it)
  - **M3:** i18n (UA/EN) + CI/CD pipeline in place
  - **M4:** Partner matching feature
  - **M5 (post-MVP, exploratory):** payments; migration to self-hosted VPS; real court integration (contingent on an actual agreement)

## 11. Repository & Transparency

- **Visibility:** public — the repo is intended to double as a reference/showcase of the author's working approach.
- **Secrets:** never committed; `.env.example` only, real `.env` files stay local/server-side.
- **PII:** no real user data (real names, real court arrangement details) in the public codebase. Public seed scripts use fake/synthetic data; real data lives only in a local or server-side private environment.

---

*This document is the high-level navigator for the project. Section-specific detail (e.g. exact API contracts, full ER diagrams, CI pipeline YAML) belongs in separate docs referenced from here as they're written.*
