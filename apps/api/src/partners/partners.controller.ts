import { Body, Controller, Get, Param, Patch, Post, UseGuards } from '@nestjs/common';
import { AuthGuard } from '../auth/auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { GoTrueJwtPayload } from '../auth/jwt-payload.interface';
import { ZodValidationPipe } from '../common/zod-validation.pipe';
import { PartnersService } from './partners.service';
import { CreateInviteDto, createInviteSchema } from './dto/create-invite.dto';
import { RespondInviteDto, respondInviteSchema } from './dto/respond-invite.dto';

@Controller('partners')
@UseGuards(AuthGuard)
export class PartnersController {
  constructor(private readonly partners: PartnersService) {}

  @Get()
  findLookingToPlay(@CurrentUser() user: GoTrueJwtPayload) {
    return this.partners.findLookingToPlay(user.sub);
  }

  @Post('invites')
  createInvite(
    @CurrentUser() user: GoTrueJwtPayload,
    @Body(new ZodValidationPipe(createInviteSchema)) dto: CreateInviteDto,
  ) {
    return this.partners.createInvite(user.sub, dto);
  }

  @Get('invites')
  listInvites(@CurrentUser() user: GoTrueJwtPayload) {
    return this.partners.listInvites(user.sub);
  }

  @Patch('invites/:id')
  respondToInvite(
    @CurrentUser() user: GoTrueJwtPayload,
    @Param('id') id: string,
    @Body(new ZodValidationPipe(respondInviteSchema)) dto: RespondInviteDto,
  ) {
    return this.partners.respondToInvite(user.sub, id, dto);
  }
}
