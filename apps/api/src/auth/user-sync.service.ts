import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { GoTrueJwtPayload } from './jwt-payload.interface';

// GoTrue owns `auth.users`; this table holds our own profile data, keyed by
// the same id. There's no webhook/trigger syncing the two, so each
// authenticated request upserts lazily instead. See DR.md §4.
@Injectable()
export class UserSyncService {
  constructor(private readonly prisma: PrismaService) {}

  async syncFromJwt(payload: GoTrueJwtPayload) {
    return this.prisma.user.upsert({
      where: { id: payload.sub },
      update: {
        email: payload.email,
        displayName: payload.user_metadata?.full_name,
        avatarUrl: payload.user_metadata?.avatar_url,
      },
      create: {
        id: payload.sub,
        email: payload.email,
        displayName: payload.user_metadata?.full_name,
        avatarUrl: payload.user_metadata?.avatar_url,
      },
    });
  }
}
