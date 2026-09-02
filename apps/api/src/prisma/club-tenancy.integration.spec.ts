// Integration test against a real Postgres (DR.md §8) for the Club /
// ClubMembership schema added by the multi-tenancy migration
// (docs/multi-tenancy-plan.md). No ClubsService/guard exists yet — this
// is schema-only work, so it exercises PrismaService directly, the same
// way the other *.integration.spec.ts files exercise their services.
import { Test } from '@nestjs/testing';
import { PrismaService } from './prisma.service';

describe('Club / ClubMembership schema (integration)', () => {
  let prisma: PrismaService;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PrismaService],
    }).compile();

    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.booking.deleteMany();
    await prisma.court.deleteMany();
    await prisma.trainer.deleteMany();
    await prisma.clubMembership.deleteMany();
    await prisma.club.deleteMany();
    await prisma.user.deleteMany();
  });

  it('creates a club with the default timezone', async () => {
    const club = await prisma.club.create({ data: { name: 'Test Club', slug: 'test-club' } });
    expect(club.timezone).toBe('Europe/Kyiv');
  });

  it('rejects a duplicate club slug', async () => {
    await prisma.club.create({ data: { name: 'Test Club', slug: 'test-club' } });
    await expect(
      prisma.club.create({ data: { name: 'Another Club', slug: 'test-club' } }),
    ).rejects.toThrow();
  });

  it('lets a court reference a club, and leaves it optional', async () => {
    const club = await prisma.club.create({ data: { name: 'Test Club', slug: 'test-club' } });
    const scoped = await prisma.court.create({
      data: { name: 'Court A', area: 'Podil', surface: 'HARD', pricePerHour: 400, clubId: club.id },
    });
    expect(scoped.clubId).toBe(club.id);

    const unscoped = await prisma.court.create({
      data: { name: 'Court B', area: 'Podil', surface: 'HARD', pricePerHour: 400 },
    });
    expect(unscoped.clubId).toBeNull();
  });

  it('grants a user a per-club role via ClubMembership', async () => {
    const club = await prisma.club.create({ data: { name: 'Test Club', slug: 'test-club' } });
    const user = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `u-${Date.now()}@test.local` },
    });

    const membership = await prisma.clubMembership.create({
      data: { userId: user.id, clubId: club.id, role: 'ADMIN' },
    });
    expect(membership.role).toBe('ADMIN');
  });

  it('refuses a duplicate membership for the same user+club', async () => {
    const club = await prisma.club.create({ data: { name: 'Test Club', slug: 'test-club' } });
    const user = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `u-${Date.now()}@test.local` },
    });
    await prisma.clubMembership.create({ data: { userId: user.id, clubId: club.id, role: 'ADMIN' } });

    await expect(
      prisma.clubMembership.create({ data: { userId: user.id, clubId: club.id, role: 'STAFF' } }),
    ).rejects.toThrow();
  });

  it('cascades membership deletion when the user is deleted', async () => {
    const club = await prisma.club.create({ data: { name: 'Test Club', slug: 'test-club' } });
    const user = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `u-${Date.now()}@test.local` },
    });
    await prisma.clubMembership.create({ data: { userId: user.id, clubId: club.id, role: 'STAFF' } });

    await prisma.user.delete({ where: { id: user.id } });
    const remaining = await prisma.clubMembership.findMany({ where: { clubId: club.id } });
    expect(remaining).toHaveLength(0);
  });

  it('refuses to delete a club that still has courts attached', async () => {
    const club = await prisma.club.create({ data: { name: 'Test Club', slug: 'test-club' } });
    await prisma.court.create({
      data: { name: 'Court A', area: 'Podil', surface: 'HARD', pricePerHour: 400, clubId: club.id },
    });

    await expect(prisma.club.delete({ where: { id: club.id } })).rejects.toThrow();
  });
});
