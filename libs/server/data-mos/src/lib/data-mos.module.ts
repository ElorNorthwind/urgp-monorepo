import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { DataMosController } from './data-mos.controller';

import { DataMosService } from './data-mos.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { DATA_MOS_HTTP_OPTIONS } from '../config/constants';

@Module({
  imports: [DatabaseModule, HttpModule.register(DATA_MOS_HTTP_OPTIONS)],
  providers: [DataMosService],
  controllers: [DataMosController],
})
export class DataMosModule {}
