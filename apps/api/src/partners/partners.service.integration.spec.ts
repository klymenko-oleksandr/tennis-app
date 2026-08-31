// Integration test against a real Postgres (DR.md §8).
import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { PrismaService } from '../prisma/prisma.service';
import { PartnersService } from './partners.service';

describe('PartnersService (integration)', () => {
  let service: PartnersService;
  let prisma: PrismaService;
  let userA: string;
  let userB: string;
  let userC: string;

  beforeAll(async () => {
    const moduleRef = await Test.createTestingModule({
      providers: [PartnersService, PrismaService],
    }).compile();

    service = moduleRef.get(PartnersService);
    prisma = moduleRef.get(PrismaService);
    await prisma.$connect();
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  beforeEach(async () => {
    await prisma.partnerMatch.deleteMany();
    await prisma.booking.deleteMany();
    await prisma.court.deleteMany();
    await prisma.user.deleteMany();

    const a = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `a-${Date.now()}@test.local`, lookingToPlayNote: 'Evenings' },
    });
    const b = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `b-${Date.now()}@test.local` },
    });
    const c = await prisma.user.create({
      data: { id: crypto.randomUUID(), email: `c-${Date.now()}@test.local` },
    });
    userA = a.id;
    userB = b.id;
    userC = c.id;
  });

  it('lists only users looking to play, excluding the current user', async () => {
    const listFromB = await service.findLookingToPlay(userB);
    expect(listFromB.map((u) => u.id)).toEqual([userA]);

    const listFromA = await service.findLookingToPlay(userA);
    expect(listFromA.map((u) => u.id)).toEqual([]);
  });

  it('rejects inviting yourself', async () => {
    await expect(service.createInvite(userA, { toUserId: userA })).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('404s when inviting a nonexistent player', async () => {
    await expect(
      service.createInvite(userA, { toUserId: crypto.randomUUID() }),
    ).rejects.toBeInstanceOf(NotFoundException);
  });

  it("rejects attaching another user's booking to an invite", async () => {
    const court = await prisma.court.create({
      data: { name: 'Court', area: 'Area', surface: 'HARD', pricePerHour: 1 },
    });
    const booking = await prisma.booking.create({
      data: { userId: userB, courtId: court.id, date: new Date('2026-09-01'), startTime: '10:00', durationMinutes: 60 },
    });

    await expect(
      service.createInvite(userA, { toUserId: userC, bookingId: booking.id }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('creates an invite and lets the recipient accept it', async () => {
    const invite = await service.createInvite(userA, { toUserId: userB });
    expect(invite.status).toBe('PENDING');

    const accepted = await service.respondToInvite(userB, invite.id, { status: 'ACCEPTED' });
    expect(accepted.status).toBe('ACCEPTED');
  });

  it("refuses to let anyone but the recipient respond to an invite", async () => {
    const invite = await service.createInvite(userA, { toUserId: userB });

    await expect(
      service.respondToInvite(userC, invite.id, { status: 'ACCEPTED' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
    // Sender can't self-approve either.
    await expect(
      service.respondToInvite(userA, invite.id, { status: 'ACCEPTED' }),
    ).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('refuses to respond to an invite twice', async () => {
    const invite = await service.createInvite(userA, { toUserId: userB });
    await service.respondToInvite(userB, invite.id, { status: 'DECLINED' });

    await expect(
      service.respondToInvite(userB, invite.id, { status: 'ACCEPTED' }),
    ).rejects.toBeInstanceOf(ConflictException);
  });

  it('lists sent and received invites separately', async () => {
    await service.createInvite(userA, { toUserId: userB });
    await service.createInvite(userC, { toUserId: userA });

    const { sent, received } = await service.listInvites(userA);
    expect(sent).toHaveLength(1);
    expect(sent[0].toUser.id).toBe(userB);
    expect(received).toHaveLength(1);
    expect(received[0].fromUser.id).toBe(userC);
  });
});
