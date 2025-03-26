import {
  BadRequestException,
  Body,
  Controller,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
  ParseIntPipe,
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
  UserApproveTo,
  Classificator,
  SelectOption,
  NestedClassificatorInfoString,
  UserControlSettings,
  casesPageFilter,
  CasesPageFilter,
  OperationClass,
  operationClassSchema,
  ApprovePathNode,
  UserApproveToChainData,
  userNotificationSettingsSchema,
  UserNotificationSettings,
  UserTelegramStatus,
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

  @Get('user-approve-to')
  async getCurrentUserApproveTo(
    @Req() req: RequestWithUserData,
  ): Promise<UserApproveTo> {
    const userId = req.user.id;
    return await this.classificators.getUserApproveTo(userId);
  }

  @Get('user-approve-chains')
  async getCurrentUserApproveChains(
    @Req() req: RequestWithUserData,
  ): Promise<UserApproveToChainData[]> {
    const userId = req.user.id;
    return await this.classificators.getUserApproveChains(userId);
  }

  @Get('executors')
  async getControlExecutors(): Promise<SelectOption<number>[]> {
    return await this.classificators.getControlExecutors();
  }

  @Get('control-to')
  async getUserControlTo(
    @Req() req: RequestWithUserData,
    @Query('extraIds')
    extraIds: OperationClass,
  ): Promise<NestedClassificatorInfo[]> {
    try {
      const correctExtraIds = z
        .string()
        .transform((value) => value.split(','))
        .pipe(
          z.array(
            z
              .string()
              .transform((value) => Number(value))
              .pipe(z.number()),
          ),
        )
        .or(z.number().array())
        .optional()
        .parse(extraIds);

      return await this.classificators.readUserControlTo(
        req.user.id,
        correctExtraIds,
      );
    } catch (e) {
      throw new BadRequestException('Некорректный список ID пользователей');
    }
  }

  // ): Promise<NestedClassificatorInfo[]> {
  //   const correctClass = operationClassSchema.parse(operationClass);

  @Get('escalation-targets')
  async getEscalationTargets(): Promise<SelectOption<number>[]> {
    return await this.classificators.getEscalationTargets();
  }

  @Get('user-data/:id')
  async getUserData(
    @Req() req: RequestWithUserData,
    @Param('id', ParseIntPipe) id: number,
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

  @Get('telegram-status')
  async getCurrentTelegamStatus(
    @Req() req: RequestWithUserData,
  ): Promise<UserTelegramStatus | null> {
    const userId = req.user.id;
    return await this.classificators.getTelegramStatus(userId);
  }

  @Get('user-settings/:id')
  async getUserSettings(
    @Req() req: RequestWithUserData,
    @Param('id', ParseIntPipe) id: number,
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
    // TODO Fix me!
    // @Body('direcrtions', new ParseArrayPipe({ items: Number, separator: ',' }))
    @Body('directions')
    directions: number[],
  ): Promise<UserControlSettings> {
    return this.classificators.setControlDirections(req.user.id, directions);
  }

  @Patch('user-settings/case-filter')
  async setCurrentUserCaseFilter(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(casesPageFilter)) dto: CasesPageFilter,
  ): Promise<UserControlSettings> {
    return this.classificators.setCaseFilter(req.user.id, dto);
  }

  @Patch('user-settings/notifications')
  async setCurrentUserNotificationSettings(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(userNotificationSettingsSchema))
    dto: UserNotificationSettings,
  ): Promise<UserControlSettings> {
    return this.classificators.setNotificationsSettings(req.user.id, dto);
  }

  @Get('case-types')
  async getCaseTypes(): Promise<NestedClassificatorInfo[]> {
    return this.classificators.getCaseTypes();
  }

  @Get('operation-types')
  async getOperationTypes(
    @Query('class')
    operationClass: OperationClass,
  ): Promise<NestedClassificatorInfo[]> {
    const correctClass = operationClassSchema.parse(operationClass);
    return this.classificators.getOperationTypes(correctClass || 'stage');
  }

  @Get('operation-types-flat')
  async getOperationTypesFlat(
    @Query('class')
    operationClass: OperationClass,
  ): Promise<Classificator[]> {
    const correctClass = operationClassSchema.parse(operationClass);
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
