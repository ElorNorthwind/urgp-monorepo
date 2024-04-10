import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExternalTokenService } from './external-token.service';
import { ExternalAuthController } from './external-auth.controller';
import { DatabaseModule } from '@urgp/server/database';
import { ExternalSessionService } from './external-session.service';
import { ExternalAuthService } from './external-auth.service';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [ExternalAuthController],
  providers: [
    ExternalTokenService,
    ExternalSessionService,
    ExternalAuthService,
  ],
  exports: [],
})
export class ExternalAuthModule {}
