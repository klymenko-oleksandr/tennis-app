// Integration test against a real Postgres (DR.md §8) — the concurrency
// logic here is exactly the kind of edge case DR.md §8 calls out for TDD.
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from './bookings.service';
import {
  CourtUnavailableException,
  TrainerUnavailableException,
} from './booking-conflict.error';

describe('BookingsService (integration)', () => {
  let service: BookingsService;
  let prisma: PrismaService;
  let courtA: string;
  let courtB: string;
  let trainer: string;
  let user: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [BookingsService, PrismaService],
    }).compile();

    service = moduleRef.get(BookingsService);
    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.booking.deleteMany();
    await prisma.trainer.deleteMany();
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();

    const u = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `u-${Date.now()}@test.local` },
    });
    user = u.id;

    const cA = await prisma.court.create({
      data: { name: 'Court A', area: 'Podil', surface: 'HARD', pricePerHour: 400 },
    });
    courtA = cA.id;

    const cB = await prisma.court.create({
      data: { name: 'Court B', area: 'Obolon', surface: 'CLAY', pricePerHour: 500 },
    });
    courtB = cB.id;

    const t = await prisma.trainer.create({
      data: { name: 'Coach T', pricePerHour: 900 },
    });
    trainer = t.id;
  });

  it('creates a booking for an open court slot', async () => {
    const booking = await service.create(user, {
      courtId: courtA,
      date: '2026-09-01',
      startTime: '10:00',
      durationMinutes: 60,
      players: 2,
    });
    expect(booking.courtId).toBe(courtA);
    expect(booking.userId).toBe(user);
  });

  it('rejects a second booking for the same court and slot', async () => {
    await service.create(user, {
      courtId: courtA,
      date: '2026-09-01',
      startTime: '10:00',
      durationMinutes: 60,
      players: 2,
    });

    await expect(
      service.create(user, {
        courtId: courtA,
        date: '2026-09-01',
        startTime: '10:00',
        durationMinutes: 60,
        players: 2,
      }),
    ).rejects.toBeInstanceOf(CourtUnavailableException);
  });

  it('allows the same trainer to be booked on a different court at a different time', async () => {
    await service.create(user, {
      courtId: courtA,
      trainerId: trainer,
      date: '2026-09-01',
      startTime: '10:00',
      durationMinutes: 60,
      players: 2,
    });

    const second = await service.create(user, {
      courtId: courtB,
      trainerId: trainer,
      date: '2026-09-01',
      startTime: '11:00',
      durationMinutes: 60,
      players: 2,
    });
    expect(second.trainerId).toBe(trainer);
  });

  it('rejects double-booking the same trainer at the same time, even on a different court', async () => {
    await service.create(user, {
      courtId: courtA,
      trainerId: trainer,
      date: '2026-09-01',
      startTime: '10:00',
      durationMinutes: 60,
      players: 2,
    });

    await expect(
      service.create(user, {
        courtId: courtB,
        trainerId: trainer,
        date: '2026-09-01',
        startTime: '10:00',
        durationMinutes: 60,
        players: 2,
      }),
    ).rejects.toBeInstanceOf(TrainerUnavailableException);
  });

  it('allows two different trainerless bookings on different courts at the same time', async () => {
    await service.create(user, {
      courtId: courtA,
      date: '2026-09-01',
      startTime: '10:00',
      durationMinutes: 60,
      players: 2,
    });

    const second = await service.create(user, {
      courtId: courtB,
      date: '2026-09-01',
      startTime: '10:00',
      durationMinutes: 60,
      players: 2,
    });
    expect(second.courtId).toBe(courtB);
  });

  it('404s when booking a court that does not exist', async () => {
    await expect(
      service.create(user, {
        courtId: crypto.randomUUID(),
        date: '2026-09-01',
        startTime: '10:00',
        durationMinutes: 60,
        players: 2,
      }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('lets the owner cancel their own booking', async () => {
    const booking = await service.create(user, {
      courtId: courtA,
      date: '2026-09-01',
      startTime: '10:00',
      durationMinutes: 60,
      players: 2,
    });

    const cancelled = await service.cancel(user, booking.id);
    expect(cancelled.status).toBe('CANCELLED');
  });

  it('refuses to let another user cancel someone else\'s booking', async () => {
    const booking = await service.create(user, {
      courtId: courtA,
      date: '2026-09-01',
      startTime: '10:00',
      durationMinutes: 60,
      players: 2,
    });

    const otherUser = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `other-${Date.now()}@test.local` },
    });

    await expect(service.cancel(otherUser.id, booking.id)).rejects.toBeInstanceOf(
      ForbiddenException,
    );
  });
});
