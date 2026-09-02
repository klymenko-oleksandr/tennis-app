// Integration test for admin booking management (DR.md backlog #12).
// Role enforcement itself is covered by auth/roles.guard.spec.ts — this
// only exercises BookingsService's admin methods.
import { NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { BookingsService } from './bookings.service';

describe('BookingsService admin methods (integration)', () => {
  let service: BookingsService;
  let prisma: PrismaService;
  let courtA: string;
  let courtB: string;
  let userA: string;
  let userB: string;

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
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();

    const cA = await prisma.court.create({
      data: { name: 'Court A', area: 'Podil', surface: 'HARD', pricePerHour: 400 },
    });
    courtA = cA.id;
    const cB = await prisma.court.create({
      data: { name: 'Court B', area: 'Obolon', surface: 'CLAY', pricePerHour: 500 },
    });
    courtB = cB.id;

    const uA = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `a-${Date.now()}@test.local` },
    });
    userA = uA.id;
    const uB = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `b-${Date.now()}@test.local` },
    });
    userB = uB.id;

    await prisma.booking.create({
      data: {
        userId: userA,
        courtId: courtA,
        date: new Date('2026-09-01'),
        startTime: '10:00',
        durationMinutes: 60,
      },
    });
    await prisma.booking.create({
      data: {
        userId: userB,
        courtId: courtB,
        date: new Date('2026-09-02'),
        startTime: '11:00',
        durationMinutes: 60,
      },
    });
  });

  it('lists every booking across all users, not just one', async () => {
    const all = await service.findAllAdmin({});
    expect(all).toHaveLength(2);
  });

  it('filters by courtId', async () => {
    const filtered = await service.findAllAdmin({ courtId: courtA });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].userId).toBe(userA);
  });

  it('filters by date', async () => {
    const filtered = await service.findAllAdmin({ date: '2026-09-02' });
    expect(filtered).toHaveLength(1);
    expect(filtered[0].userId).toBe(userB);
  });

  it('cancels a booking that does not belong to the admin, no ownership check', async () => {
    const [booking] = await service.findAllAdmin({ courtId: courtA });
    const cancelled = await service.cancelAsAdmin(booking.id);
    expect(cancelled.status).toBe('CANCELLED');
  });

  it('404s cancelling a booking that does not exist', async () => {
    await expect(service.cancelAsAdmin(crypto.randomUUID())).rejects.toBeInstanceOf(
      NotFoundException,
    );
  });
});
