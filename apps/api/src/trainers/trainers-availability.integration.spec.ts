// Integration test for real free-slot computation on trainers, plus the
// court-filtering annotation (DR.md backlog #11).
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TrainersService } from './trainers.service';

const TEST_DATE = '2026-09-01';
const TEST_DAY_OF_WEEK = new Date(`${TEST_DATE}T00:00:00Z`).getUTCDay();

describe('TrainersService.findAvailability (integration)', () => {
  let service: TrainersService;
  let prisma: PrismaService;
  let trainerId: string;
  let courtA: string;
  let courtB: string;
  let userId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TrainersService, PrismaService],
    }).compile();

    service = moduleRef.get(TrainersService);
    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.trainerCourt.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.trainer.deleteMany();
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();

    const trainer = await prisma.trainer.create({ data: { name: 'Coach T', pricePerHour: 900 } });
    trainerId = trainer.id;

    const cA = await prisma.court.create({
      data: { name: 'Court A', area: 'Podil', surface: 'HARD', pricePerHour: 400 },
    });
    courtA = cA.id;
    const cB = await prisma.court.create({
      data: { name: 'Court B', area: 'Obolon', surface: 'CLAY', pricePerHour: 500 },
    });
    courtB = cB.id;

    await prisma.trainerCourt.createMany({
      data: [
        { trainerId, courtId: courtA },
        { trainerId, courtId: courtB },
      ],
    });

    const user = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `u-${Date.now()}@test.local` },
    });
    userId = user.id;

    await prisma.availability.createMany({
      data: [
        { trainerId, dayOfWeek: TEST_DAY_OF_WEEK, startTime: '09:00', endTime: '17:00' },
        { courtId: courtA, dayOfWeek: TEST_DAY_OF_WEEK, startTime: '09:00', endTime: '17:00' },
        { courtId: courtB, dayOfWeek: TEST_DAY_OF_WEEK, startTime: '09:00', endTime: '17:00' },
      ],
    });
  });

  it('returns the trainer free slots with both linked courts available', async () => {
    const slots = await service.findAvailability(trainerId, TEST_DATE);
    const slot10 = slots.find((s) => s.time === '10:00');
    expect(slot10?.status).toBe('available');
    expect(slot10?.availableCourtIds.sort()).toEqual([courtA, courtB].sort());
  });

  it('excludes a court from availableCourtIds when it is busy even though the trainer is free', async () => {
    await prisma.booking.create({
      data: {
        userId,
        courtId: courtA,
        date: new Date(`${TEST_DATE}T00:00:00Z`),
        startTime: '10:00',
        durationMinutes: 60,
      },
    });

    const slots = await service.findAvailability(trainerId, TEST_DATE);
    const slot10 = slots.find((s) => s.time === '10:00');
    expect(slot10?.status).toBe('available'); // trainer themself is free
    expect(slot10?.availableCourtIds).toEqual([courtB]); // court A excluded
  });

  it('gives a booked trainer slot an empty availableCourtIds', async () => {
    await prisma.booking.create({
      data: {
        userId,
        courtId: courtA,
        trainerId,
        date: new Date(`${TEST_DATE}T00:00:00Z`),
        startTime: '10:00',
        durationMinutes: 60,
      },
    });

    const slots = await service.findAvailability(trainerId, TEST_DATE);
    const slot10 = slots.find((s) => s.time === '10:00');
    expect(slot10?.status).toBe('booked');
    expect(slot10?.availableCourtIds).toEqual([]);
  });
});
