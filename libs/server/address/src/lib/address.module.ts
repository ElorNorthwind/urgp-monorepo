import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { AddressService } from './address.service';
import { AddressController } from './address.controller';
import { AddressSessionsService } from './address-sessions.service';

@Module({
  imports: [DatabaseModule],
  providers: [AddressService, AddressSessionsService],
  controllers: [AddressController],
})
export class AddressModule {}
