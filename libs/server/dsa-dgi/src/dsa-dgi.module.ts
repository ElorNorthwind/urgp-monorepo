import { Module } from '@nestjs/common';
import { DsaDgiService } from './dsa-dgi.service';

@Module({
  controllers: [],
  providers: [DsaDgiService],
  exports: [DsaDgiService],
})
export class DsaDgiModule {}
