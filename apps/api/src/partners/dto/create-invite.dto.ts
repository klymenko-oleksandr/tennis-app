import { z } from 'zod';

export const createInviteSchema = z.object({
  toUserId: z.uuid(),
  bookingId: z.uuid().nullish(),
});

export type CreateInviteDto = z.infer<typeof createInviteSchema>;
