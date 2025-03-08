import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { DaDataController } from './dadata.controller';

import { HttpModule } from '@nestjs/axios';
import { DADATA_HTTP_OPTIONS } from '../config/constants';
import { DaDataService } from './dadata.service';

@Module({
  imports: [DatabaseModule, HttpModule.register(DADATA_HTTP_OPTIONS)],
  providers: [DaDataService],
  controllers: [DaDataController],
  exports: [DaDataService],
})
export class DaDataModule {}
