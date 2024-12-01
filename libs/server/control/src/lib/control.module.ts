import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';
import { ControlController } from './control.controller';
import { ControlService } from './control.service';

@Module({
  imports: [DatabaseModule],
  providers: [ControlService],
  controllers: [ControlController],
})
export class ControlModule {}
