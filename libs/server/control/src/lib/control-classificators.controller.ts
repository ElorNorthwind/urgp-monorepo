import {
  Body,
  Controller,
  Get,
  Param,
  ParseArrayPipe,
  Patch,
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
  NestedClassificatorInfoString,
  UserControlSettings,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ControlClassificatorsService } from './control-classificators.service';
import { CacheTTL } from '@nestjs/cache-manager';

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

  @Get('user-settings')
  async getCurrentUserSettings(
    @Req() req: RequestWithUserData,
  ): Promise<UserControlSettings> {
    const userId = req.user.id;
    return await this.classificators.getControlSettings(userId);
  }

  @Get('user-settings/:id')
  async getUserSettings(
    @Req() req: RequestWithUserData,
    @Param('id') id: number,
  ): Promise<UserControlSettings> {
    const userId = req.user.id;
    const controlData = await this.classificators.getControlData(userId);
    if (userId !== id && !controlData.roles.includes('admin')) {
      throw new UnauthorizedException(
        'Операция не разрешена. Настройки пользователя доступны только ему самому или администратору!',
      );
    }
    return this.classificators.getControlSettings(id);
  }

  @Patch('user-settings/directions')
  async setCurrentUserDirections(
    @Req() req: RequestWithUserData,
    @Body('direcrtions', new ParseArrayPipe({ items: Number, separator: ',' }))
    directions: number[],
  ): Promise<UserControlSettings> {
    const userId = req.user.id;
    return this.classificators.setControlDirections(req.user.id, directions);
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

  @Get('case-department-types')
  async getDepartmentTypes(): Promise<NestedClassificatorInfoString[]> {
    return this.classificators.getDepartmentTypes();
  }

  // getCaseDirectionTypes
}
