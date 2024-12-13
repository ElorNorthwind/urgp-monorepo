import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';
import { ControlCasesController } from './control-cases.controller';
import { ControlCaseService } from './control-cases.service';
import { ControlOperationsService } from './control-operations.service';
import { ControlOperationsController } from './control-operations.controller';
import { ControlClassificatorsService } from './control-classificators.service';
import { ControlClassificatorsController } from './control-classificators.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    ControlCaseService,
    ControlOperationsService,
    ControlClassificatorsService,
  ],
  controllers: [
    ControlCasesController,
    ControlOperationsController,
    ControlClassificatorsController,
  ],
})
export class ControlModule {}
