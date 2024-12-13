import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ControlCaseService } from './control-cases.service';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  RequestWithUserData,
  CaseCreateDto,
  caseCreate,
  caseUpdate,
  CaseUpdateDto,
  userInputApprove,
  UserInputApproveDto,
  userInputDelete,
  UserInputDeleteDto,
  UserControlData,
  ClassificatorInfo,
  NestedClassificatorInfo,
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
  async getCaseTypes(): Promise<ClassificatorInfo[]> {
    return this.classificators.getCaseTypes();
  }

  @Get('operation-types')
  async getOperationTypes(): Promise<NestedClassificatorInfo[]> {
    return this.classificators.getOperationTypes();
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
