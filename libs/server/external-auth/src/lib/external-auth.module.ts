import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExternalTokenService } from './external-token.service';
import { ExternalAuthController } from './external-auth.controller';
import { DatabaseModule } from '@urgp/server/database';
import { ExternalSessionsService } from './external-sessions.service';
import { ExternalAuthService } from './external-auth.service';

@Module({
  imports: [HttpModule, DatabaseModule],
  controllers: [ExternalAuthController],
  providers: [
    ExternalTokenService,
    ExternalSessionsService,
    ExternalAuthService,
  ],
  exports: [ExternalAuthService],
})
export class ExternalAuthModule {}
