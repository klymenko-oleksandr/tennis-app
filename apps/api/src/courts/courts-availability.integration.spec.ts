// Integration test for real free-slot computation (DR.md backlog #10).
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CourtsService } from './courts.service';

const TEST_DATE = '2026-09-01';
const TEST_DAY_OF_WEEK = new Date(`${TEST_DATE}T00:00:00Z`).getUTCDay();
const OTHER_DAY_OF_WEEK = (TEST_DAY_OF_WEEK + 1) % 7;

describe('CourtsService.findAvailability (integration)', () => {
  let service: CourtsService;
  let prisma: PrismaService;
  let courtId: string;
  let userId: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [CourtsService, PrismaService],
    }).compile();

    service = moduleRef.get(CourtsService);
    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.booking.deleteMany();
    await prisma.availability.deleteMany();
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();

    const court = await prisma.court.create({
      data: { name: 'Court A', area: 'Podil', surface: 'HARD', pricePerHour: 400 },
    });
    courtId = court.id;

    const user = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `u-${Date.now()}@test.local` },
    });
    userId = user.id;

    await prisma.availability.create({
      data: { courtId, dayOfWeek: TEST_DAY_OF_WEEK, startTime: '09:00', endTime: '17:00' },
    });
  });

  it('returns available slots minus an existing booking', async () => {
    await prisma.booking.create({
      data: {
        userId,
        courtId,
        date: new Date(`${TEST_DATE}T00:00:00Z`),
        startTime: '10:00',
        durationMinutes: 60,
      },
    });

    const slots = await service.findAvailability(courtId, TEST_DATE);
    expect(slots.length).toBeGreaterThan(1);
    expect(slots.find((s) => s.time === '10:00')?.status).toBe('booked');
    expect(slots.find((s) => s.time === '09:00')?.status).toBe('available');
    expect(slots.find((s) => s.time === '11:00')?.status).toBe('available');
  });

  it('returns an empty list for a date with no matching Availability row', async () => {
    // TEST_DATE only has an Availability row for TEST_DAY_OF_WEEK — query a
    // date landing on a different weekday instead.
    const otherDate = new Date(`${TEST_DATE}T00:00:00Z`);
    otherDate.setUTCDate(otherDate.getUTCDate() + ((OTHER_DAY_OF_WEEK - TEST_DAY_OF_WEEK + 7) % 7));
    const otherDateStr = otherDate.toISOString().slice(0, 10);

    const slots = await service.findAvailability(courtId, otherDateStr);
    expect(slots).toEqual([]);
  });

  it('ignores a cancelled booking when computing free slots', async () => {
    await prisma.booking.create({
      data: {
        userId,
        courtId,
        date: new Date(`${TEST_DATE}T00:00:00Z`),
        startTime: '10:00',
        durationMinutes: 60,
        status: 'CANCELLED',
      },
    });

    const slots = await service.findAvailability(courtId, TEST_DATE);
    expect(slots.find((s) => s.time === '10:00')?.status).toBe('available');
  });
});
