// Integration test for the Trainer↔Court relationship (DR.md backlog #9),
// covering both query directions and the admin setCourts write path.
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { TrainersService } from './trainers.service';
import { CourtsService } from '../courts/courts.service';

describe('Trainer↔Court relationship (integration)', () => {
  let trainers: TrainersService;
  let courts: CourtsService;
  let prisma: PrismaService;
  let courtA: string;
  let courtB: string;
  let courtC: string;
  let trainer: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [TrainersService, CourtsService, PrismaService],
    }).compile();

    trainers = moduleRef.get(TrainersService);
    courts = moduleRef.get(CourtsService);
    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.trainerCourt.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.trainer.deleteMany();
    await prisma.court.deleteMany();

    const cA = await prisma.court.create({
      data: { name: 'Court A', area: 'Podil', surface: 'HARD', pricePerHour: 400 },
    });
    courtA = cA.id;
    const cB = await prisma.court.create({
      data: { name: 'Court B', area: 'Obolon', surface: 'CLAY', pricePerHour: 500 },
    });
    courtB = cB.id;
    const cC = await prisma.court.create({
      data: { name: 'Court C', area: 'Pechersk', surface: 'GRASS', pricePerHour: 600 },
    });
    courtC = cC.id;

    const t = await prisma.trainer.create({ data: { name: 'Coach T', pricePerHour: 900 } });
    trainer = t.id;
  });

  it('assigns a trainer to 2 of 3 courts and queries both directions', async () => {
    const updated = await trainers.setCourts(trainer, [courtA, courtB]);
    expect(updated.courts.map((c) => c.id).sort()).toEqual([courtA, courtB].sort());

    const trainersAtA = await courts.findTrainers(courtA);
    expect(trainersAtA.map((t) => t.id)).toEqual([trainer]);

    const trainersAtC = await courts.findTrainers(courtC);
    expect(trainersAtC).toEqual([]);
  });

  it('setCourts fully replaces the previous assignment', async () => {
    await trainers.setCourts(trainer, [courtA, courtB]);
    const replaced = await trainers.setCourts(trainer, [courtC]);
    expect(replaced.courts.map((c) => c.id)).toEqual([courtC]);

    const trainersAtA = await courts.findTrainers(courtA);
    expect(trainersAtA).toEqual([]);
  });
});
