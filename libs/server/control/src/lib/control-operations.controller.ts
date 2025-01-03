import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  Patch,
  Post,
  Req,
  UnauthorizedException,
  UseGuards,
} from '@nestjs/common';
import { ZodValidationPipe } from '@urgp/server/pipes';
import {
  RequestWithUserData,
  userInputApprove,
  UserInputApproveDto,
  controlStageCreate,
  ControlStageCreateDto,
  ControlOperation,
  controlStageUpdate,
  ControlStageUpdateDto,
  userInputDelete,
  UserInputDeleteDto,
  ControlOperationPayloadHistoryData,
  defineControlAbilityFor,
  ControlStageSlim,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ControlOperationsService } from './control-operations.service';
import { ControlClassificatorsService } from './control-classificators.service';

@Controller('control/operation')
@UseGuards(AccessTokenGuard)
export class ControlOperationsController {
  constructor(
    private readonly controlOperations: ControlOperationsService,
    private readonly classificators: ControlClassificatorsService,
  ) {}

  @Post('stage')
  async createStage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(controlStageCreate)) dto: ControlStageCreateDto,
  ) {
    const i = defineControlAbilityFor(req.user);

    if (i.cannot('create', dto)) {
      throw new UnauthorizedException('Нет прав на создание');
    }

    const operationTypes = await this.classificators.getOperationTypesFlat();

    const autoApproved = !!operationTypes.find((operation) => {
      return operation.id === dto.type;
    })?.autoApprove;

    const correctApprover =
      dto?.approver ??
      req.user?.controlData?.approvers?.operations?.[0] ??
      (autoApproved ? req.user.id : null);

    const subject = {
      ...dto,
      approver: correctApprover,
      class: 'control-incident',
    };

    if (!autoApproved && i.cannot('set-approver', subject)) {
      throw new UnauthorizedException(
        'Операция не разрешена. Согласующий не доступен пользователю!',
      );
    }

    const approved = autoApproved || correctApprover === req.user.id;

    return this.controlOperations.createStage(
      {
        ...dto,
        approver: correctApprover,
      },
      req.user.id,
      approved,
    );
  }

  @Get(':id')
  getOperationById(@Param('id') id: number): Promise<ControlOperation> {
    return this.controlOperations.readFullOperationById(id);
  }

  @Get(':id/history')
  getOperationPayloadHistory(
    @Param('id') id: number,
  ): Promise<ControlOperationPayloadHistoryData[]> {
    return this.controlOperations.readOperationPayloadHistory(id);
  }

  @Get('stage/by-case/:id')
  getStagesByCaseId(
    @Req() req: RequestWithUserData,
    @Param('id') id: number,
  ): Promise<ControlOperation[]> {
    return this.controlOperations.readOperationsByCaseId(
      id,
      req.user.id,
      'stage',
    );
  }

  @Patch('stage')
  async updateStage(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(controlStageUpdate)) dto: ControlStageUpdateDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentOperation = await this.controlOperations.readSlimOperationById(
      dto.id,
    );

    if (
      i.cannot('update', {
        ...currentOperation,
        class: 'stage',
      } as ControlStageSlim)
    ) {
      throw new UnauthorizedException('Нет прав на изменение');
    }

    if (
      i.cannot('set-approver', {
        ...currentOperation,
        class: 'stage',
      } as ControlStageSlim)
    ) {
      Logger.warn(
        'Согласующий недоступен',
        JSON.stringify({
          currentApprover: currentOperation.payload.approver,
          dtoApprover: dto.approver,
          userFio: req.user.fio,
          userApprovers: req.user.controlData?.approvers?.cases,
        }),
      );
      throw new UnauthorizedException(
        'Операция не разрешена. Согласующий не доступен пользователю!',
      );
    }

    return this.controlOperations.updateStage(dto, req.user.id);
  }

  @Delete()
  async deleteOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(userInputDelete)) dto: UserInputDeleteDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentOperation = await this.controlOperations.readSlimOperationById(
      dto.id,
    );

    if (i.cannot('delete', currentOperation as ControlStageSlim)) {
      throw new BadRequestException('Нет прав на удаление!');
    }

    return this.controlOperations.deleteOperation(dto.id, req.user.id);
  }

  @Patch('approve')
  async approveOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(userInputApprove)) dto: UserInputApproveDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentOperation = await this.controlOperations.readSlimOperationById(
      dto.id,
    );

    if (
      i.cannot('approve', {
        ...currentOperation,
        class: 'stage',
      } as ControlStageSlim)
    ) {
      throw new UnauthorizedException(
        'Операция не разрешена. Нет прав на редактирование!',
      );
    }

    const newApprover =
      dto.approveStatus === 'rejected'
        ? currentOperation.authorId
        : dto?.nextApprover ||
          req.user?.controlData?.approvers?.cases?.[0] ||
          null;

    if (
      i.cannot('set-approver', {
        ...currentOperation,
        class: 'stage',
      } as ControlStageSlim) ||
      i.cannot('set-approver', {
        ...dto,
        approver: newApprover,
        class: 'stage',
      })
    ) {
      Logger.warn(
        'Согласующий недоступен',
        JSON.stringify({
          currentApprover: currentOperation.payload.approver,
          dtoApprover: newApprover,
          userFio: req.user.fio,
          userApprovers: req.user.controlData?.approvers?.cases,
        }),
      );
      throw new UnauthorizedException('Согласующий недоступен пользователю!');
    }

    return this.controlOperations.approveOperation(
      {
        ...dto,
        approveStatus:
          dto.approveStatus === 'rejected'
            ? 'rejected'
            : newApprover === req.user.id
              ? dto.approveStatus
              : 'pending',
      },
      req.user.id,
      newApprover,
    );
  }
}
