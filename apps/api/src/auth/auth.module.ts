import { Global, Module } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtModule } from '@nestjs/jwt';
import { AuthController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { UserSyncService } from './user-sync.service';
import { Env } from '../config/env';

const jwtModule = JwtModule.registerAsync({
  inject: [ConfigService],
  useFactory: (config: ConfigService<Env, true>) => ({
    secret: config.get('GOTRUE_JWT_SECRET', { infer: true }),
  }),
});

// Global — AuthGuard is used via `@UseGuards(AuthGuard)` (class reference)
// across feature modules, which resolves the guard's own dependencies
// (JwtService) in the *consuming* module's context, not AuthModule's. Being
// global, and re-exporting JwtModule, makes JwtService resolvable everywhere.
@Global()
@Module({
  imports: [jwtModule],
  controllers: [AuthController],
  providers: [AuthGuard, UserSyncService],
  exports: [AuthGuard, jwtModule],
})
export class AuthModule {}
