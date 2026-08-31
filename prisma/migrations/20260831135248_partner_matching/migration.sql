/*
  Warnings:

  - Added the required column `updatedAt` to the `partner_matches` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "partner_matches" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "lookingToPlayNote" TEXT;

-- AddForeignKey
ALTER TABLE "partner_matches" ADD CONSTRAINT "partner_matches_bookingId_fkey" FOREIGN KEY ("bookingId") REFERENCES "bookings"("id") ON DELETE SET NULL ON UPDATE CASCADE;
