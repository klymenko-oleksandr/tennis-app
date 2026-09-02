-- CreateTable
CREATE TABLE "trainer_courts" (
    "trainerId" UUID NOT NULL,
    "courtId" UUID NOT NULL,

    CONSTRAINT "trainer_courts_pkey" PRIMARY KEY ("trainerId","courtId")
);

-- AddForeignKey
ALTER TABLE "trainer_courts" ADD CONSTRAINT "trainer_courts_trainerId_fkey" FOREIGN KEY ("trainerId") REFERENCES "trainers"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "trainer_courts" ADD CONSTRAINT "trainer_courts_courtId_fkey" FOREIGN KEY ("courtId") REFERENCES "courts"("id") ON DELETE CASCADE ON UPDATE CASCADE;
