import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { computeFreeSlots } from '../availability/free-slots.util';
import { CreateCourtDto } from './dto/create-court.dto';
import { UpdateCourtDto } from './dto/update-court.dto';

@Injectable()
export class CourtsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.court.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const court = await this.prisma.court.findUnique({ where: { id } });
    if (!court) {
      throw new NotFoundException('Court not found');
    }
    return court;
  }

  // Real free-slot computation (DR.md backlog #10) — Availability minus
  // existing Bookings for the given date. This is advisory for the
  // frontend; BookingsService.create still relies on the DB's unique
  // constraint as the final concurrency-safe check (DR.md §5).
  async findAvailability(id: string, date: string) {
    await this.findOne(id);
    const dayOfWeek = new Date(`${date}T00:00:00Z`).getUTCDay();

    const [windows, bookings] = await Promise.all([
      this.prisma.availability.findMany({
        where: { courtId: id, dayOfWeek },
        select: { startTime: true, endTime: true },
      }),
      this.prisma.booking.findMany({
        where: { courtId: id, date: new Date(`${date}T00:00:00Z`), status: 'CONFIRMED' },
        select: { startTime: true, durationMinutes: true },
      }),
    ]);

    return computeFreeSlots(windows, bookings);
  }

  // Which coaches work at this court (DR.md backlog #9) — the reverse of
  // TrainersService.findOne's embedded `courts`.
  async findTrainers(id: string) {
    await this.findOne(id);
    const links = await this.prisma.trainerCourt.findMany({
      where: { courtId: id },
      include: { trainer: true },
      orderBy: { trainer: { name: 'asc' } },
    });
    return links.map((link) => link.trainer);
  }

  create(dto: CreateCourtDto) {
    return this.prisma.court.create({ data: dto });
  }

  async update(id: string, dto: UpdateCourtDto) {
    await this.findOne(id);
    return this.prisma.court.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.court.delete({ where: { id } });
    } catch (error) {
      // Booking.court is onDelete: Restrict — a court with existing
      // bookings can't be hard-deleted. Surface a clear error instead of
      // the raw FK violation.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException(
          'This court has existing bookings and cannot be deleted.',
        );
      }
      throw error;
    }
  }
}
