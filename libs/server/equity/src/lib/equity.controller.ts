import {
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  NotFoundException,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { AccessTokenGuard } from '@urgp/server/auth';
import {
  CreateEquityOperationDto,
  createEquityOperationSchema,
  defineEquityAbilityFor,
  EgrnDetails,
  EquityClaim,
  EquityComplexData,
  EquityObject,
  EquityOperation,
  EquityTimeline,
  EquityTotals,
  NestedClassificatorInfo,
  RequestWithUserData,
  UpdateEquityOperationDto,
} from '@urgp/shared/entities';

import { EquityService } from './equity.service';
import { ZodValidationPipe } from '@urgp/server/pipes';

@Controller('equity')
// @UseGuards(AccessTokenGuard)
export class EquityController {
  constructor(private readonly equity: EquityService) {}

  @Get('/complex-list')
  async getComplexList(): Promise<EquityComplexData[]> {
    return this.equity.getEquityComplexList();
  }

  @Get('/objects/totals')
  async getObjectsTotals(): Promise<EquityTotals[]> {
    return this.equity.getEquityObjectsTotals();
  }

  @Get('/objects/timeline')
  async getObjectsTimeline(): Promise<EquityTimeline[]> {
    return this.equity.getEquityObjectsTimeline();
  }

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

  @Get('/by-object/:id/egrn')
  async getEgrnDetailsByObjectId(
    @Param('id', ParseIntPipe) objectId: number,
  ): Promise<EgrnDetails | null> {
    return this.equity.getEgrnDetailsByObjectId(objectId);
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

  @Get('/classificators/buildings')
  async getBuildingsClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.equity.getBuildingsClassificator();
  }

  @Get('/classificators/object-status')
  async getObjectStatusClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.equity.getObjectStatusClassificator();
  }

  @Get('/classificators/object-type')
  async getObjectTypeClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.equity.getObjectTypeClassificator();
  }

  @Get('/classificators/operation-type')
  async getOperationTypeClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.equity.getOperationTypeClassificator();
  }

  @UseGuards(AccessTokenGuard)
  @Post('/operation')
  async createOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(createEquityOperationSchema))
    dto: CreateEquityOperationDto,
  ) {
    const userId = req.user.id;
    const i = defineEquityAbilityFor(req.user);
    if (i.cannot('create', dto))
      throw new UnauthorizedException('Нет прав на создание');
    return this.equity.createOperation(userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Patch('/operation')
  async updateOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(createEquityOperationSchema))
    dto: UpdateEquityOperationDto,
  ) {
    const userId = req.user.id;
    const i = defineEquityAbilityFor(req.user);
    if (i.cannot('update', dto))
      throw new UnauthorizedException('Нет прав на редактирование');
    return this.equity.updateOperation(userId, dto);
  }

  @UseGuards(AccessTokenGuard)
  @Delete('/operation')
  async deleteOperation(
    @Req() req: RequestWithUserData,
    @Body('id', ParseIntPipe) id: number,
  ) {
    const oldOperation = await this.equity.getOperationById(id);
    if (!oldOperation) throw new NotFoundException('Операция не найдена');
    const i = defineEquityAbilityFor(req.user);
    if (i.cannot('delete', oldOperation))
      throw new UnauthorizedException('Нет прав на редактирование');
    return this.equity.deleteOperation(id);
  }
}
