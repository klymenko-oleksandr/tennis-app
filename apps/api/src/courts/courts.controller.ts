import { Controller, Get, Param } from '@nestjs/common';
import { CourtsService } from './courts.service';

// Public — browsing courts doesn't require auth.
@Controller('courts')
export class CourtsController {
  constructor(private readonly courts: CourtsService) {}

  @Get()
  findAll() {
    return this.courts.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.courts.findOne(id);
  }
}
