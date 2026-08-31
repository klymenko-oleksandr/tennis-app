import { Body, Controller, Delete, Get, Param, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { GoTrueJwtPayload } from '../auth/jwt-payload.interface';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { BookingsService } from './bookings.service';
import { CreateBookingDto, createBookingSchema } from './dto/create-booking.dto';

@Controller('bookings')
@UseGuards(AuthGuard)
export class BookingsController {
  constructor(private readonly bookings: BookingsService) {}

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
