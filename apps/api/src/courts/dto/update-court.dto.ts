import { z } from 'zod';
import { createCourtSchema } from './create-court.dto';

export const updateCourtSchema = createCourtSchema.partial();

export type UpdateCourtDto = z.infer<typeof updateCourtSchema>;
