import { ForbiddenException, Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { Prisma } from '@prisma/client';
import { CreateBookingDto } from './dto/create-booking.dto';
import {
  CourtUnavailableException,
  TrainerUnavailableException,
} from './booking-conflict.error';

const COURT_SLOT_CONSTRAINT = 'bookings_courtId_date_startTime_key';
const TRAINER_SLOT_CONSTRAINT = 'bookings_trainerId_date_startTime_key';

// The @prisma/adapter-pg driver reports the violated constraint name under
// meta.driverAdapterError.cause.constraint.index, not the flatter meta.target
// used by Prisma's built-in (non-adapter) query engine. Handle both so this
// keeps working if the underlying error shape changes again.
function getViolatedConstraint(meta: unknown): string | undefined {
  const m = meta as Record<string, unknown> | undefined;
  const fromAdapter = (
    m?.driverAdapterError as
      | { cause?: { constraint?: { index?: string } } }
      | undefined
  )?.cause?.constraint?.index;
  if (fromAdapter) return fromAdapter;

  const target = m?.target;
  if (Array.isArray(target)) return target.join('_');
  if (typeof target === 'string') return target;
  return undefined;
}

@Injectable()
export class BookingsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(userId: string, dto: CreateBookingDto) {
    const court = await this.prisma.court.findUnique({ where: { id: dto.courtId } });
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    if (dto.trainerId) {
      const trainer = await this.prisma.trainer.findUnique({ where: { id: dto.trainerId } });
      if (!trainer) {
        throw new NotFoundException('Trainer not found');
      }
    }

    try {
      return await this.prisma.booking.create({
        data: {
          userId,
          courtId: dto.courtId,
          trainerId: dto.trainerId ?? null,
          date: new Date(dto.date),
          startTime: dto.startTime,
          durationMinutes: dto.durationMinutes,
          players: dto.players,
          notes: dto.notes ?? null,
        },
      });
    } catch (error) {
      throw this.mapConflict(error);
    }
  }

  findMine(userId: string) {
    return this.prisma.booking.findMany({
      where: { userId },
      include: { court: true, trainer: true },
      orderBy: [{ date: 'asc' }, { startTime: 'asc' }],
    });
  }

  async cancel(userId: string, bookingId: string) {
    const booking = await this.prisma.booking.findUnique({ where: { id: bookingId } });
    if (!booking) {
      throw new NotFoundException('Booking not found');
    }
    // IDOR prevention (DR.md §9) — being logged in isn't enough, must own it.
    if (booking.userId !== userId) {
      throw new ForbiddenException("You don't own this booking");
    }
    return this.prisma.booking.update({
      where: { id: bookingId },
      data: { status: 'CANCELLED' },
    });
  }

  private mapConflict(error: unknown): unknown {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      const constraint = getViolatedConstraint(error.meta);
      if (constraint === TRAINER_SLOT_CONSTRAINT) {
        return new TrainerUnavailableException();
      }
      if (constraint === COURT_SLOT_CONSTRAINT) {
        return new CourtUnavailableException();
      }
    }
    return error;
  }
}
