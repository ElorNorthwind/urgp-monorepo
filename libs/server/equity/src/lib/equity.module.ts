import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';
import { EquityService } from './equity.service';
import { EquityController } from './equity.controller';

@Module({
  imports: [DatabaseModule],
  providers: [EquityService],
  controllers: [EquityController],
})
export class EquityModule {}
