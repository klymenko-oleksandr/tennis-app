import { Controller, Get, Param } from '@nestjs/common';
import { TrainersService } from './trainers.service';

// Public — browsing trainers doesn't require auth.
@Controller('trainers')
export class TrainersController {
  constructor(private readonly trainers: TrainersService) {}

  @Get()
  findAll() {
    return this.trainers.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.trainers.findOne(id);
  }
}
