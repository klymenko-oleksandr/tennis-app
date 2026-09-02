import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { CurrentUser } from '../auth/current-user.decorator';
import { GoTrueJwtPayload } from '../auth/jwt-payload.interface';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, createBookingSchema } from './dto/create-booking.dto';
import { AdminBookingsQueryDto, adminBookingsQuerySchema } from './dto/admin-bookings-query.dto';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

  // Admin-only — everyone else lists their own via GET /bookings/me.
  @Get()
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  findAllAdmin(
    @Query(new ZodValidationPipe(adminBookingsQuerySchema)) query: AdminBookingsQueryDto,
  ) {
    return this.bookings.findAllAdmin(query);
  }

  // Admin-only override — cancel any booking, not just your own.
  @Patch(':id/cancel')
  @UseGuards(RolesGuard)
  @Roles('ADMIN')
  cancelAsAdmin(@Param('id') id: string) {
    return this.bookings.cancelAsAdmin(id);
  }

  @Post()
  create(
    @CurrentUser() user: GoTrueJwtPayload,
    @Body(new ZodValidationPipe(createBookingSchema)) dto: CreateBookingDto,
  ) {
    return this.bookings.create(user.sub, dto);
  }

  @Get('me')
  findMine(@CurrentUser() user: GoTrueJwtPayload) {
    return this.bookings.findMine(user.sub);
  }

  @Delete(':id')
  cancel(@CurrentUser() user: GoTrueJwtPayload, @Param('id') id: string) {
    return this.bookings.cancel(user.sub, id);
  }
}
