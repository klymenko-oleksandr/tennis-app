import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TrainersService {
  constructor(private readonly prisma: PrismaService) {}

  findAll() {
    return this.prisma.trainer.findMany({ orderBy: { name: 'asc' } });
  }

  async findOne(id: string) {
    const trainer = await this.prisma.trainer.findUnique({ where: { id } });
    if (!trainer) {
      throw new NotFoundException('Trainer not found');
    }
    return trainer;
  }
}
