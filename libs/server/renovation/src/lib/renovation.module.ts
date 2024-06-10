import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';
import { RenovationController } from './renovation.controller';
import { RenovationService } from './renovation.service';

@Module({
  imports: [DatabaseModule],
  providers: [RenovationService],
  controllers: [RenovationController],
})
export class RenovationModule {}
