import { z } from 'zod';

export const setTrainerCourtsSchema = z.object({
  courtIds: z.array(z.uuid()),
});

export type SetTrainerCourtsDto = z.infer<typeof setTrainerCourtsSchema>;
