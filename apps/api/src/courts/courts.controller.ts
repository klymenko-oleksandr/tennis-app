import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { CourtsService } from './courts.service';
import { CreateCourtDto, createCourtSchema } from './dto/create-court.dto';
import { UpdateCourtDto, updateCourtSchema } from './dto/update-court.dto';

const availabilityQuerySchema = z.object({ date: z.iso.date() });

@Controller('courts')
export class CourtsController {
  constructor(private readonly courts: CourtsService) {}

  // Public — browsing courts doesn't require auth.
  @Get()
  findAll() {
    return this.courts.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courts.findOne(id);
  }

  @Get(':id/trainers')
  findTrainers(@Param('id') id: string) {
    return this.courts.findTrainers(id);
  }

  @Get(':id/availability')
  findAvailability(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(availabilityQuerySchema)) query: { date: string },
  ) {
    return this.courts.findAvailability(id, query.date);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body(new ZodValidationPipe(createCourtSchema)) dto: CreateCourtDto) {
    return this.courts.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateCourtSchema)) dto: UpdateCourtDto,
  ) {
    return this.courts.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.courts.remove(id);
  }
}
