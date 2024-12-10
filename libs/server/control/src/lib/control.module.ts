import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';
import { ControlController } from './control.controller';
import { ControlCaseService } from './control-cases.service';

@Module({
  imports: [DatabaseModule],
  providers: [ControlCaseService],
  controllers: [ControlController],
})
export class ControlModule {}
