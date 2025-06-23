import {
  Controller,
  Get,
  Param,
  ParseIntPipe,
  UseGuards,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import {
  EquityClaim,
  EquityObject,
  EquityOperation,
} from '@urgp/shared/entities';

import { EquityService } from './equity.service';

@Controller('equity')
// @UseGuards(AccessTokenGuard)
export class EquityController {
  constructor(private readonly equity: EquityService) {}

  @Get('/objects')
  async getObjects(): Promise<EquityObject[]> {
    return this.equity.getObjects();
  }

  @Get('/object/:id')
  async getObjectById(
    @Param('id', ParseIntPipe) objectId: number,
  ): Promise<EquityObject | null> {
    return this.equity.getObjectById(objectId);
  }

  @Get('/by-object/:id/claims')
  async getClaimsByObjectId(
    @Param('id', ParseIntPipe) objectId: number,
  ): Promise<EquityClaim[]> {
    return this.equity.getClaimsByObjectId(objectId);
  }

  @Get('/by-object/:id/operations')
  async getOperationsByObjectId(
    @Param('id', ParseIntPipe) objectId: number,
  ): Promise<EquityOperation[]> {
    return this.equity.getOperationsByObjectId(objectId);
  }
}
