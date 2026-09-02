import { Body, Controller, Delete, Get, Param, Patch, Post, Put, Query, UseGuards } from '@nestjs/common';
import { z } from 'zod';
import { AuthGuard } from '../auth/auth.guard';
import { RolesGuard } from '../auth/roles.guard';
import { Roles } from '../auth/roles.decorator';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { TrainersService } from './trainers.service';
import { CreateTrainerDto, createTrainerSchema } from './dto/create-trainer.dto';
import { UpdateTrainerDto, updateTrainerSchema } from './dto/update-trainer.dto';
import { SetTrainerCourtsDto, setTrainerCourtsSchema } from './dto/set-trainer-courts.dto';

const availabilityQuerySchema = z.object({ date: z.iso.date() });

@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainers: TrainersService) {}

  // Public — browsing trainers doesn't require auth.
  @Get()
  findAll() {
    return this.trainers.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainers.findOne(id);
  }

  @Get(':id/availability')
  findAvailability(
    @Param('id') id: string,
    @Query(new ZodValidationPipe(availabilityQuerySchema)) query: { date: string },
  ) {
    return this.trainers.findAvailability(id, query.date);
  }

  @Post()
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  create(@Body(new ZodValidationPipe(createTrainerSchema)) dto: CreateTrainerDto) {
    return this.trainers.create(dto);
  }

  @Patch(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateTrainerSchema)) dto: UpdateTrainerDto,
  ) {
    return this.trainers.update(id, dto);
  }

  @Delete(':id')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  remove(@Param('id') id: string) {
    return this.trainers.remove(id);
  }

  // Full replace of which courts this trainer works at (DR.md backlog #9).
  @Put(':id/courts')
  @UseGuards(AuthGuard, RolesGuard)
  @Roles('ADMIN')
  setCourts(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(setTrainerCourtsSchema)) dto: SetTrainerCourtsDto,
  ) {
    return this.trainers.setCourts(id, dto.courtIds);
  }
}
