import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { ExternalLoginService } from './external-login.service';
import { ExternalAuthController } from './external-auth.controller';

@Module({
  imports: [HttpModule],
  controllers: [ExternalAuthController],
  providers: [ExternalLoginService],
  exports: [ExternalLoginService],
})
export class ExternalAuthModule {}
