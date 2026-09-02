-- Backfills a single "Default Club" and assigns every pre-existing
-- court/trainer/booking row to it, so the nullable `clubId` columns added
-- in the previous migration aren't left empty on data that predates the
-- Club concept. Also mirrors every existing ADMIN user into a
-- club_memberships row for that club, so club-scoped admin checks (once
-- built — see docs/multi-tenancy-plan.md) have something to find.
--
-- Deliberately does NOT touch `users.role` — narrowing it to a
-- platform-level USER | SUPERADMIN flag is a separate follow-up that also
-- has to update every @Roles('ADMIN') call site at the same time.
--
-- Idempotent-safe: on a fresh/empty database (e.g. CI's test DB) this
-- still creates one unused "Default Club" row, but every UPDATE/INSERT
-- below matches zero rows since there's no pre-existing data to migrate.
DO $$
DECLARE
  default_club_id UUID;
BEGIN
  INSERT INTO "clubs" ("id", "name", "slug", "timezone", "createdAt", "updatedAt")
  VALUES (gen_random_uuid(), 'Default Club', 'default-club', 'Europe/Kyiv', now(), now())
  RETURNING "id" INTO default_club_id;

  UPDATE "courts" SET "clubId" = default_club_id WHERE "clubId" IS NULL;
  UPDATE "trainers" SET "clubId" = default_club_id WHERE "clubId" IS NULL;
  UPDATE "bookings" SET "clubId" = default_club_id WHERE "clubId" IS NULL;

  INSERT INTO "club_memberships" ("userId", "clubId", "role")
  SELECT "id", default_club_id, 'ADMIN'
  FROM "users"
  WHERE "role" = 'ADMIN';
END $$;
