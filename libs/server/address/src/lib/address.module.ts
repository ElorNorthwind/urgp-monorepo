import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { AddressService } from './address.service';
import { AddressController } from './address.controller';

@Module({
  imports: [DatabaseModule],
  providers: [AddressService],
  controllers: [AddressController],
})
export class AddressModule {}
