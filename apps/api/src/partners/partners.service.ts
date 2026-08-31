import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateInviteDto } from './dto/create-invite.dto';
import { RespondInviteDto } from './dto/respond-invite.dto';

// Never expose email across users — only what's needed to evaluate a
// potential partner or an invite (DR.md §9 PII hygiene).
const PUBLIC_PROFILE_SELECT = {
  id: true,
  displayName: true,
  ntrpLevel: true,
  lookingToPlayNote: true,
} as const;

@Injectable()
export class PartnersService {
  constructor(private readonly prisma: PrismaService) {}

  findLookingToPlay(currentUserId: string) {
    return this.prisma.user.findMany({
      where: {
        id: { not: currentUserId },
        lookingToPlayNote: { not: null },
      },
      select: PUBLIC_PROFILE_SELECT,
      orderBy: { updatedAt: 'desc' },
    });
  }

  async createInvite(fromUserId: string, dto: CreateInviteDto) {
    if (dto.toUserId === fromUserId) {
      throw new BadRequestException("You can't invite yourself");
    }

    const toUser = await this.prisma.user.findUnique({ where: { id: dto.toUserId } });
    if (!toUser) {
      throw new NotFoundException('Player not found');
    }

    if (dto.bookingId) {
      const booking = await this.prisma.booking.findUnique({ where: { id: dto.bookingId } });
      if (!booking) {
        throw new NotFoundException('Booking not found');
      }
      // IDOR prevention (DR.md §9) — can only attach your own booking.
      if (booking.userId !== fromUserId) {
        throw new ForbiddenException("You don't own this booking");
      }
    }

    return this.prisma.partnerMatch.create({
      data: { fromUserId, toUserId: dto.toUserId, bookingId: dto.bookingId ?? null },
      include: { toUser: { select: PUBLIC_PROFILE_SELECT }, booking: { include: { court: true } } },
    });
  }

  async listInvites(userId: string) {
    const [sent, received] = await Promise.all([
      this.prisma.partnerMatch.findMany({
        where: { fromUserId: userId },
        include: { toUser: { select: PUBLIC_PROFILE_SELECT }, booking: { include: { court: true } } },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.partnerMatch.findMany({
        where: { toUserId: userId },
        include: { fromUser: { select: PUBLIC_PROFILE_SELECT }, booking: { include: { court: true } } },
        orderBy: { createdAt: 'desc' },
      }),
    ]);
    return { sent, received };
  }

  async respondToInvite(userId: string, inviteId: string, dto: RespondInviteDto) {
    const invite = await this.prisma.partnerMatch.findUnique({ where: { id: inviteId } });
    if (!invite) {
      throw new NotFoundException('Invite not found');
    }
    // IDOR prevention (DR.md §9) — only the recipient can accept/decline.
    if (invite.toUserId !== userId) {
      throw new ForbiddenException("This invite isn't addressed to you");
    }
    if (invite.status !== 'PENDING') {
      throw new ConflictException('This invite was already responded to');
    }

    return this.prisma.partnerMatch.update({
      where: { id: inviteId },
      data: { status: dto.status },
      include: { fromUser: { select: PUBLIC_PROFILE_SELECT }, booking: { include: { court: true } } },
    });
  }
}
