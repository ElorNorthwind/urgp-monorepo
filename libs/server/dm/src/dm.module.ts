import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';
import { DmController } from './dm.controller';
import { DmService } from './dm.service';

@Module({
  imports: [DatabaseModule],
  controllers: [DmController],
  providers: [DmService],
})
export class DmModule {}
