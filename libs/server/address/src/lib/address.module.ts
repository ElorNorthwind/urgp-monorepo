import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressSessionsService } from './address-sessions.service';
import { FiasModule } from '@urgp/server/fias';

@Module({
  imports: [DatabaseModule, FiasModule],
  providers: [AddressService, AddressSessionsService],
  controllers: [AddressController],
})
export class AddressModule {}
