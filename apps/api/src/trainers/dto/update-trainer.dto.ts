import { z } from 'zod';
import { createTrainerSchema } from './create-trainer.dto';

export const updateTrainerSchema = createTrainerSchema.partial();

export type UpdateTrainerDto = z.infer<typeof updateTrainerSchema>;
