import { Module } from '@nestjs/common';
import { RsmApiModule } from './api/api.module';

@Module({
  imports: [RsmApiModule],
  exports: [RsmApiModule],
})
export class RsmModule {}
