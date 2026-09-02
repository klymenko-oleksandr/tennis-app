import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { computeFreeSlots, type TimeSlot } from '../availability/free-slots.util';
import { CreateTrainerDto } from './dto/create-trainer.dto';
import { UpdateTrainerDto } from './dto/update-trainer.dto';

@Injectable()
export class TrainersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.trainer.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const trainer = await this.prisma.trainer.findUnique({
      where: { id },
      include: { courts: { include: { court: true } } },
    });
    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }
    const { courts, ...rest } = trainer;
    return { ...rest, courts: courts.map((c) => c.court) };
  }

  create(dto: CreateTrainerDto) {
    return this.prisma.trainer.create({ data: dto });
  }

  async update(id: string, dto: UpdateTrainerDto) {
    await this.findOne(id);
    return this.prisma.trainer.update({ where: { id }, data: dto });
  }

  async remove(id: string) {
    await this.findOne(id);
    try {
      await this.prisma.trainer.delete({ where: { id } });
    } catch (error) {
      // Booking.trainer is onDelete: Restrict, same as Booking.court.
      if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2003') {
        throw new ConflictException(
          'This trainer has existing bookings and cannot be deleted.',
        );
      }
      throw error;
    }
  }

  // Real free-slot computation for a trainer (DR.md backlog #11), mirroring
  // CourtsService.findAvailability. Each available slot is additionally
  // annotated with `availableCourtIds` — which of this trainer's linked
  // courts (#9) are ALSO free at that exact time — so the frontend's
  // "coach detail → pick free slot → pick from their courts" flow doesn't
  // need N follow-up calls. This annotation is a judgment call made without
  // the frontend in front of me; if the actual booking-flow UI wants a
  // different shape, this is the one place to change.
  async findAvailability(id: string, date: string) {
    await this.findOne(id);
    const dayOfWeek = new Date(`${date}T00:00:00Z`).getUTCDay();

    const [windows, bookings, courtLinks] = await Promise.all([
      this.prisma.availability.findMany({
        where: { trainerId: id, dayOfWeek },
        select: { startTime: true, endTime: true },
      }),
      this.prisma.booking.findMany({
        where: { trainerId: id, date: new Date(`${date}T00:00:00Z`), status: 'CONFIRMED' },
        select: { startTime: true, durationMinutes: true },
      }),
      this.prisma.trainerCourt.findMany({ where: { trainerId: id }, select: { courtId: true } }),
    ]);

    const trainerSlots = computeFreeSlots(windows, bookings);

    const courtSlotsByCourtId = new Map<string, TimeSlot[]>();
    await Promise.all(
      courtLinks.map(async ({ courtId }) => {
        const [courtWindows, courtBookings] = await Promise.all([
          this.prisma.availability.findMany({
            where: { courtId, dayOfWeek },
            select: { startTime: true, endTime: true },
          }),
          this.prisma.booking.findMany({
            where: { courtId, date: new Date(`${date}T00:00:00Z`), status: 'CONFIRMED' },
            select: { startTime: true, durationMinutes: true },
          }),
        ]);
        courtSlotsByCourtId.set(courtId, computeFreeSlots(courtWindows, courtBookings));
      }),
    );

    return trainerSlots.map((slot) => ({
      ...slot,
      availableCourtIds:
        slot.status === 'available'
          ? courtLinks
              .filter(({ courtId }) =>
                courtSlotsByCourtId
                  .get(courtId)
                  ?.some((s) => s.time === slot.time && s.status === 'available'),
              )
              .map(({ courtId }) => courtId)
          : [],
    }));
  }

  // Full replace, not incremental add/remove — simplest match for an admin
  // form that shows a checkbox list of courts and submits the whole set.
  async setCourts(id: string, courtIds: string[]) {
    await this.findOne(id);
    await this.prisma.$transaction([
      this.prisma.trainerCourt.deleteMany({ where: { trainerId: id } }),
      this.prisma.trainerCourt.createMany({
        data: courtIds.map((courtId) => ({ trainerId: id, courtId })),
      }),
    ]);
    return this.findOne(id);
  }
}
