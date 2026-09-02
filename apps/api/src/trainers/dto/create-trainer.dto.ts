import { z } from 'zod';

export const createTrainerSchema = z.object({
  name: z.string().min(1).max(200),
  credential: z.string().max(300).nullish(),
  bio: z.string().max(2000).nullish(),
  pricePerHour: z.number().int().positive(),
});

export type CreateTrainerDto = z.infer<typeof createTrainerSchema>;
