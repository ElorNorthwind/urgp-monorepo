import { Module } from '@nestjs/common';
import { RsmAuthService } from './auth.service';
import { RsmApiController } from './api.controller';
import { DatabaseModule } from '@urgp/server/database';

@Module({
  imports: [DatabaseModule],
  providers: [RsmAuthService],
  controllers: [RsmApiController],
})
export class RsmApiModule {}
