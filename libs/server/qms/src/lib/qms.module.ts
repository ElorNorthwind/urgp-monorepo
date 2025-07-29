import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { QmsController } from './qms.controller';

import { HttpModule } from '@nestjs/axios';
import { QMS_HTTP_OPTIONS } from '../config/constants';
import { QmsService } from './qms.service';

@Module({
  imports: [DatabaseModule, HttpModule.register(QMS_HTTP_OPTIONS)],
  providers: [QmsService],
  controllers: [QmsController],
  exports: [QmsService],
})
export class QmsModule {}
