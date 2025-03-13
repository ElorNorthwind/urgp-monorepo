import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { HttpModule } from '@nestjs/axios';
import { TelegramService } from './telegram.service';

@Module({
  imports: [DatabaseModule],
  providers: [TelegramService],
  exports: [TelegramService],
})
export class TelegramModule {}
