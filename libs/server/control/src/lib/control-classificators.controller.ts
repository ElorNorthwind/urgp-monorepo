import {
  Body,
  Controller,
  Get,
  Logger,
  Param,
  Query,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import {
  RequestWithUserData,
  UserControlData,
  NestedClassificatorInfo,
  UserControlApprovers,
  TypeInfo,
  ControlOperationClass,
  controlOperationClass,
  SelectOption,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ControlClassificatorsService } from './control-classificators.service';
import { CacheTTL } from '@nestjs/cache-manager';
import { ZodValidationPipe } from '@urgp/server/pipes';
import { z } from 'zod';

@Controller('control/classificators')
@CacheTTL(1000 * 60 * 60)
@UseGuards(AccessTokenGuard)
export class ControlClassificatorsController {
  constructor(private readonly classificators: ControlClassificatorsService) {}

  @Get('user-data')
  async getCurrentUserData(
    @Req() req: RequestWithUserData,
  ): Promise<UserControlData> {
    const userId = req.user.id;
    return await this.classificators.getControlData(userId);
  }

  @Get('user-approvers')
  async getCurrentUserApprovers(
    @Req() req: RequestWithUserData,
  ): Promise<UserControlApprovers> {
    const userId = req.user.id;
    return await this.classificators.getUserApprovers(userId);
  }

  @Get('executors')
  async getControlExecutors(): Promise<SelectOption<number>[]> {
    return await this.classificators.getControlExecutors();
  }

  @Get('user-data/:id')
  async getUserData(
    @Req() req: RequestWithUserData,
    @Param('id') id: number,
  ): Promise<UserControlData> {
    const userId = req.user.id;
    const controlData = await this.classificators.getControlData(userId);
    if (userId !== id && !controlData.roles.includes('admin')) {
      throw new UnauthorizedException(
        'Операция не разрешена. Информация о пользователе доступна только ему самому или администратору!',
      );
    }
    return this.classificators.getControlData(id);
  }

  @Get('case-types')
  async getCaseTypes(): Promise<NestedClassificatorInfo[]> {
    return this.classificators.getCaseTypes();
  }

  @Get('operation-types')
  async getOperationTypes(
    @Query('class')
    operationClass: ControlOperationClass,
  ): Promise<NestedClassificatorInfo[]> {
    const correctClass = controlOperationClass.safeParse(operationClass).data;
    return this.classificators.getOperationTypes(correctClass || 'stage');
  }

  @Get('operation-types-flat')
  async getOperationTypesFlat(
    @Query('class')
    operationClass: ControlOperationClass,
  ): Promise<TypeInfo[]> {
    const correctClass = controlOperationClass.safeParse(operationClass).data;
    return this.classificators.getOperationTypesFlat(correctClass || 'stage');
  }

  @Get('case-status-types')
  async getCaseStatusTypes(): Promise<NestedClassificatorInfo[]> {
    return this.classificators.getCaseStatusTypes();
  }

  @Get('case-direction-types')
  async getCaseDirectionTypes(): Promise<NestedClassificatorInfo[]> {
    return this.classificators.getCaseDirectionTypes();
  }

  // getCaseDirectionTypes
}
