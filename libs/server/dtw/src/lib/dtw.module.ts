import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { HttpModule } from '@nestjs/axios';
import { DTW_HTTP_OPTIONS } from '../config/constants';
import { DtwService } from './dtw.service';
import { DtwController } from './dtw.controller';

@Module({
  imports: [DatabaseModule, HttpModule.register(DTW_HTTP_OPTIONS)],
  providers: [DtwService],
  controllers: [DtwController],
  exports: [DtwService],
})
export class DtwModule {}
