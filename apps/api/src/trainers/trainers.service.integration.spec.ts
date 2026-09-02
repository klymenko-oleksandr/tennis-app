// Integration test against a real Postgres (DR.md §8), mirroring
// courts.service.integration.spec.ts. Role enforcement is covered by
// auth/roles.guard.spec.ts — this only exercises CRUD logic.
import { ConflictException, NotFoundException } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TrainersService } from './trainers.service';

describe('TrainersService (integration)', () => {
  let service: TrainersService;
  let prisma: PrismaService;

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
    await prisma.booking.deleteMany();
    await prisma.trainer.deleteMany();
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();
  });

  it('creates a trainer', async () => {
    const trainer = await service.create({ name: 'Coach T', pricePerHour: 900 });
    expect(trainer.name).toBe('Coach T');
  });

  it('updates a trainer', async () => {
    const trainer = await service.create({ name: 'Coach T', pricePerHour: 900 });
    const updated = await service.update(trainer.id, { pricePerHour: 950 });
    expect(updated.pricePerHour).toBe(950);
  });

  it('404s updating a trainer that does not exist', async () => {
    await expect(
      service.update(crypto.randomUUID(), { pricePerHour: 950 }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it('deletes a trainer with no bookings', async () => {
    const trainer = await service.create({ name: 'Coach T', pricePerHour: 900 });
    await service.remove(trainer.id);
    await expect(service.findOne(trainer.id)).rejects.toBeInstanceOf(NotFoundException);
  });

  it('refuses to delete a trainer with existing bookings', async () => {
    const trainer = await service.create({ name: 'Coach T', pricePerHour: 900 });
    const court = await prisma.court.create({
      data: { name: 'Court A', area: 'Podil', surface: 'HARD', pricePerHour: 400 },
    });
    const user = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `u-${Date.now()}@test.local` },
    });
    await prisma.booking.create({
      data: {
        userId: user.id,
        courtId: court.id,
        trainerId: trainer.id,
        date: new Date('2026-09-01'),
        startTime: '10:00',
        durationMinutes: 60,
      },
    });

    await expect(service.remove(trainer.id)).rejects.toBeInstanceOf(ConflictException);
  });
});
