-- Partial unique index: a trainer can't be double-booked for the same slot,
-- but a booking may have no trainer (courtId+date+startTime alone already
-- prevents double-booking the court). Prisma's schema DSL doesn't support
-- partial indexes, so this is hand-written. See DR.md §5.
CREATE UNIQUE INDEX "bookings_trainerId_date_startTime_key"
ON "bookings" ("trainerId", "date", "startTime")
WHERE "trainerId" IS NOT NULL;
