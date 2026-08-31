import { z } from 'zod';

export const createBookingSchema = z.object({
  courtId: z.uuid(),
  trainerId: z.uuid().nullish(),
  date: z.iso.date(), // "YYYY-MM-DD"
  startTime: z.string().regex(/^([01]\d|2[0-3]):[0-5]\d$/, 'Expected "HH:MM"'),
  durationMinutes: z.number().int().positive().max(240),
  players: z.number().int().min(1).max(8).default(2),
  notes: z.string().max(1000).nullish(),
});

export type CreateBookingDto = z.infer<typeof createBookingSchema>;
