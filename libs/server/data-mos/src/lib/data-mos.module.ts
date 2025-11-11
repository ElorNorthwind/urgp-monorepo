import { Module } from '@nestjs/common';

import { DataMosController } from './data-mos.controller';

import { HttpModule } from '@nestjs/axios';
import { GeoDbModule } from '@urgp/server/geo-db';
import { DATA_MOS_HTTP_OPTIONS } from '../config/constants';
import { DataMosService } from './data-mos.service';

@Module({
  imports: [GeoDbModule, HttpModule.register(DATA_MOS_HTTP_OPTIONS)],
  providers: [DataMosService],
  controllers: [DataMosController],
})
export class DataMosModule {}
