import { z } from 'zod';

export const adminBookingsQuerySchema = z.object({
  date: z.iso.date().optional(),
  courtId: z.uuid().optional(),
  status: z.enum(['CONFIRMED', 'CANCELLED']).optional(),
});

export type AdminBookingsQueryDto = z.infer<typeof adminBookingsQuerySchema>;
