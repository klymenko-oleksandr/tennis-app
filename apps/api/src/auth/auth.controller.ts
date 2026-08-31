import { Controller, Get, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import { GoTrueJwtPayload } from './jwt-payload.interface';
import { UserSyncService } from './user-sync.service';

@Controller('auth')
export class AuthController {
  constructor(private readonly userSync: UserSyncService) {}

  // Called once by the frontend right after sign-in to create/refresh the
  // local profile row from the GoTrue-issued token. See DR.md §4.
  @UseGuards(AuthGuard)
  @Get('me')
  async me(@CurrentUser() jwt: GoTrueJwtPayload) {
    return this.userSync.syncFromJwt(jwt);
  }
}
