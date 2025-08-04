import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';
import { HttpModule } from '@nestjs/axios';
import { SudirController } from './sudir.controller';
import { SudirService } from './sudir.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [SudirService],
  controllers: [SudirController],
})
export class SudirModule {}
