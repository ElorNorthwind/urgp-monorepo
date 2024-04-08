import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExternalAuthService } from './external-auth.service';
import { ExternalAuthController } from './external-auth.controller';

@Module({
  imports: [HttpModule],
  controllers: [ExternalAuthController],
  providers: [ExternalAuthService],
  exports: [ExternalAuthService],
})
export class ExternalAuthModule {}
