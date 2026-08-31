import { z } from 'zod';

export const respondInviteSchema = z.object({
  status: z.enum(['ACCEPTED', 'DECLINED']),
});

export type RespondInviteDto = z.infer<typeof respondInviteSchema>;
