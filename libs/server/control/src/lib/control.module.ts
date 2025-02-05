import { Module } from '@nestjs/common';
import { DatabaseModule } from '@urgp/server/database';

import { ControlCasesController } from './control-cases.controller';
import { ControlCasesService } from './control-cases.service';
import { ControlOperationsController } from './control-operations.controller';

import { ControlOperationsService } from './control-operations.service';
import { ControlClassificatorsService } from './control-classificators.service';
import { ControlClassificatorsController } from './control-classificators.controller';

@Module({
  imports: [DatabaseModule],
  providers: [
    ControlCasesService,
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
