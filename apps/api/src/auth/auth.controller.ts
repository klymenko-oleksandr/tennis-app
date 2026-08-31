import { Body, Controller, Get, Patch, UseGuards } from '@nestjs/common';
import { AuthGuard } from './auth.guard';
import { CurrentUser } from './current-user.decorator';
import { GoTrueJwtPayload } from './jwt-payload.interface';
import { UserSyncService } from './user-sync.service';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { UpdateProfileDto, updateProfileSchema } from './dto/update-profile.dto';

@Controller('auth')
@UseGuards(AuthGuard)
export class AuthController {
  constructor(private readonly userSync: UserSyncService) {}

  // Called once by the frontend right after sign-in to create/refresh the
  // local profile row from the GoTrue-issued token. See DR.md §4.
  @Get('me')
  async me(@CurrentUser() jwt: GoTrueJwtPayload) {
    return this.userSync.syncFromJwt(jwt);
  }

  @Patch('me')
  async updateMe(
    @CurrentUser() jwt: GoTrueJwtPayload,
    @Body(new ZodValidationPipe(updateProfileSchema)) dto: UpdateProfileDto,
  ) {
    return this.userSync.updateProfile(jwt.sub, dto);
  }
}
