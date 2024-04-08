import { Module } from '@nestjs/common';
import { ExternalSessionService } from './session.service';

@Module({
  controllers: [],
  providers: [ExternalSessionService],
  exports: [ExternalSessionService],
})
export class SessionsModule {}
