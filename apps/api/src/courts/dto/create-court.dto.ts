import { z } from 'zod';

export const createCourtSchema = z.object({
  name: z.string().min(1).max(200),
  area: z.string().min(1).max(200),
  address: z.string().max(300).nullish(),
  surface: z.enum(['CLAY', 'HARD', 'GRASS', 'CARPET']),
  indoor: z.boolean().default(false),
  pricePerHour: z.number().int().positive(),
  description: z.string().max(2000).nullish(),
});

export type CreateCourtDto = z.infer<typeof createCourtSchema>;
