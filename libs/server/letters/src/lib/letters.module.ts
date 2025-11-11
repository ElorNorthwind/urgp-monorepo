import { HttpModule } from '@nestjs/axios';
import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';
import { TelegramModule } from '@urgp/server/telegram';
import { LettersController } from './letters.controller';
import { LettersService } from './letters.service';

@Module({
  imports: [DatabaseModule, TelegramModule, HttpModule],
  providers: [LettersService],
  controllers: [LettersController],
})
export class LettersModule {}
