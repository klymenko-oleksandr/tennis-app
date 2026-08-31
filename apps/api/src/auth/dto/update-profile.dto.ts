import { z } from 'zod';

export const updateProfileSchema = z.object({
  displayName: z.string().min(1).max(100).nullish(),
  ntrpLevel: z.number().min(1).max(7).nullish(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
