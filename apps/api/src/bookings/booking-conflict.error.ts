import { ConflictException } from '@nestjs/common';

export class CourtUnavailableException extends ConflictException {
  constructor() {
    super('This court is already booked for that time.');
  }
}

export class TrainerUnavailableException extends ConflictException {
  constructor() {
    super('This coach is already booked for that time.');
  }
}
