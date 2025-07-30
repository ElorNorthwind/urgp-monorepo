import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { VksController } from './vks.controller';

import { HttpModule } from '@nestjs/axios';
import { VksService } from './vks.service';

@Module({
  imports: [DatabaseModule, HttpModule],
  providers: [VksService],
  controllers: [VksController],
  exports: [VksService],
})
export class VksModule {}
