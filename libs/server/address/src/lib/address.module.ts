import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressSessionsService } from './address-sessions.service';
import { FiasModule } from '@urgp/server/fias';
import { DaDataModule } from '@urgp/server/dadata';

@Module({
  imports: [DatabaseModule, FiasModule, DaDataModule],
  providers: [AddressService, AddressSessionsService],
  controllers: [AddressController],
})
export class AddressModule {}
