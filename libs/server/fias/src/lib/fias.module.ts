import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { FiasController } from './fias.controller';

import { FiasService } from './fias.service';
import { HttpModule, HttpService } from '@nestjs/axios';
import { FIAS_HTTP_OPTIONS } from '../config/constants';
import { DaDataModule } from '@urgp/server/dadata';

@Module({
  imports: [
    DatabaseModule,
    HttpModule.register(FIAS_HTTP_OPTIONS),
    DaDataModule,
  ],
  providers: [FiasService],
  controllers: [FiasController],
  exports: [FiasService],
})
export class FiasModule {}
