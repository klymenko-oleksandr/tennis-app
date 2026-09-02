// Integration test against a real Postgres (DR.md §8), mirroring the
// pattern in bookings.service.integration.spec.ts. Role enforcement itself
// is covered by auth/roles.guard.spec.ts — this only exercises CRUD logic.
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { CourtsService } from './courts.service';

describe('CourtsService (integration)', () => {
  let service: CourtsService;
  let prisma: PrismaService;

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
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();
  });

  it('creates a court', async () => {
    const court = await service.create({
      name: 'Test Court',
      area: 'Podil',
      surface: 'HARD',
      indoor: false,
      pricePerHour: 400,
    });
    expect(court.name).toBe('Test Court');
  });

  it('updates a court', async () => {
    const court = await service.create({
      name: 'Test Court',
      area: 'Podil',
      surface: 'HARD',
      indoor: false,
      pricePerHour: 400,
    });

    const updated = await service.update(court.id, { pricePerHour: 500 });
    expect(updated.pricePerHour).toBe(500);
  });

  it('404s updating a court that does not exist', async () => {
    await expect(
      service.update(crypto.randomUUID(), { pricePerHour: 500 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes a court with no bookings', async () => {
    const court = await service.create({
      name: 'Test Court',
      area: 'Podil',
      surface: 'HARD',
      indoor: false,
      pricePerHour: 400,
    });

    await service.remove(court.id);
    await expect(service.findOne(court.id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('refuses to delete a court with existing bookings', async () => {
    const court = await service.create({
      name: 'Test Court',
      area: 'Podil',
      surface: 'HARD',
      indoor: false,
      pricePerHour: 400,
    });
    const user = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `u-${Date.now()}@test.local` },
    });
    await prisma.booking.create({
      data: {
        userId: user.id,
        courtId: court.id,
        date: new Date('2026-09-01'),
        startTime: '10:00',
        durationMinutes: 60,
      },
    });

    await expect(service.remove(court.id)).rejects.toBeInstanceOf(ConflictException);
  });
});
