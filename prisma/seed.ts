// Fake Kyiv courts/trainers, reused from the Rally design reference
// (Baseline design system) — never real user or business data (DR.md §11).
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient({
  adapter: new PrismaPg({ connectionString: process.env.DATABASE_URL }),
});

const courts = [
  {
    name: 'Pechersk Tennis Club',
    area: 'Pechersk',
    surface: 'CLAY' as const,
    indoor: true,
    pricePerHour: 480,
    description:
      'A calm indoor clay club on Pechersk with six well-kept courts, professional lighting and a small café.',
  },
  {
    name: 'Podil Lawn Courts',
    area: 'Podil',
    surface: 'GRASS' as const,
    indoor: false,
    pricePerHour: 650,
    description:
      'One of the few grass courts in the city, set among the parkland of Podil. Seasonal and pristine.',
  },
  {
    name: 'Obolon Sport Complex',
    area: 'Obolon',
    surface: 'HARD' as const,
    indoor: false,
    pricePerHour: 400,
    description:
      'Busy outdoor hard-court complex in the heart of Obolon. Affordable, central and open late.',
  },
  {
    name: 'Shevchenkivskyi Indoor',
    area: 'Shevchenkivskyi',
    surface: 'HARD' as const,
    indoor: true,
    pricePerHour: 520,
    description:
      'Modern indoor hard-court center with consistent surfaces year-round and a strong coaching team.',
  },
  {
    name: 'Borschagivka Tennis Park',
    area: 'Borschagivka',
    surface: 'CLAY' as const,
    indoor: false,
    pricePerHour: 340,
    description: 'Quiet outdoor clay courts on Borschagivka, surrounded by greenery. Rarely crowded.',
  },
];

const trainers = [
  {
    name: 'Oleksiy Kovalenko',
    credential: 'Former ATP · clay specialist',
    pricePerHour: 900,
    bio: 'Former touring pro coaching in Kyiv for eight years. Focuses on reliable technique and a smart all-court game.',
  },
  {
    name: 'Iryna Savchenko',
    credential: 'LTA Level 4 · juniors & technique',
    pricePerHour: 800,
    bio: 'Certified coach with a decade developing juniors and adult improvers. Calm, structured sessions.',
  },
  {
    name: 'Dmytro Bondar',
    credential: 'Strength & match play',
    pricePerHour: 750,
    bio: 'High-energy coach blending on-court drilling with conditioning, for players preparing for league play.',
  },
];

// Operating hours: every day, 07:00-22:00, for every seeded court/trainer.
function weeklyHours() {
  return Array.from({ length: 7 }, (_, dayOfWeek) => ({
    dayOfWeek,
    startTime: '07:00',
    endTime: '22:00',
  }));
}

async function main() {
  await prisma.availability.deleteMany();
  await prisma.booking.deleteMany();
  await prisma.court.deleteMany();
  await prisma.trainer.deleteMany();

  for (const court of courts) {
    await prisma.court.create({
      data: { ...court, availabilities: { create: weeklyHours() } },
    });
  }

  for (const trainer of trainers) {
    await prisma.trainer.create({
      data: { ...trainer, availabilities: { create: weeklyHours() } },
    });
  }

  console.log(`Seeded ${courts.length} courts and ${trainers.length} trainers.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
