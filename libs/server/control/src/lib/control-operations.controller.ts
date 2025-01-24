import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  Logger,
  Param,
  ParseArrayPipe,
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
  dispatchCreate,
  DispatchCreateDto,
  ReminderCreateDto,
  dispatchUpdate,
  DispatchUpdateDto,
  ControlDispatchSlim,
  reminderUpdate,
  ReminderUpdateDto,
  ControlReminderSlim,
  ControlDispatch,
  ControlStage,
  ControlReminder,
  reminderCreate,
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
      return operation.id === dto.typeId;
    })?.autoApprove;

    const correctApproverId =
      dto?.approverId ??
      req.user?.controlData?.approvers?.operations?.[0] ??
      (autoApproved ? req.user.id : null);

    const subject = {
      ...dto,
      approver: correctApproverId,
      class: 'control-incident',
    };

    if (!autoApproved && i.cannot('set-approver', subject)) {
      throw new UnauthorizedException(
        'Операция не разрешена. Согласующий не доступен пользователю!',
      );
    }

    const approved = autoApproved || correctApproverId === req.user.id;

    return this.controlOperations.createStage(
      {
        ...dto,
        approverId: correctApproverId,
      },
      req.user.id,
      approved,
    );
  }

  @Post('dispatch')
  async createDispatch(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(dispatchCreate)) dto: DispatchCreateDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    if (i.cannot('create', dto)) {
      throw new UnauthorizedException('Нет прав на создание');
    }
    return this.controlOperations.createDispatch(dto, req.user.id);
  }

  @Post('reminder')
  async createReminder(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(reminderCreate)) dto: ReminderCreateDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    if (i.cannot('create', dto)) {
      throw new UnauthorizedException('Нет прав на создание');
    }
    return this.controlOperations.createReminder(dto, req.user.id);
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
  ): Promise<ControlStage[]> {
    // Считаем дело отсмотренным, если по нему загрузились этапы
    // this.controlOperations.updateRemindersByCaseIds([id], req.user.id);
    return this.controlOperations.readOperationsByCaseId(
      id,
      req.user.id,
      'stage',
    ) as Promise<ControlStage[]>;
  }

  @Get('dispatch/by-case/:id')
  getDispatchesByCaseId(
    @Req() req: RequestWithUserData,
    @Param('id') id: number,
  ): Promise<ControlDispatch[]> {
    return this.controlOperations.readOperationsByCaseId(
      id,
      req.user.id,
      'dispatch',
    ) as Promise<ControlDispatch[]>;
  }

  @Get('reminder/by-case/:id')
  getRemindersByCaseId(
    @Req() req: RequestWithUserData,
    @Param('id') id: number,
  ): Promise<ControlReminder[]> {
    return this.controlOperations.readOperationsByCaseId(
      id,
      req.user.id,
      'reminder',
    ) as Promise<ControlReminder[]>;
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
          currentApprover: currentOperation.payload.approverId,
          dtoApprover: dto.approverId,
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

  @Patch('dispatch')
  async updateDispatch(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(dispatchUpdate)) dto: DispatchUpdateDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentDispatch = await this.controlOperations.readSlimOperationById(
      dto.id,
    );

    if (
      i.cannot('update', {
        ...currentDispatch,
        class: 'dispatch',
      } as ControlDispatchSlim) ||
      i.cannot('update', { ...dto, class: 'dispatch' })
    ) {
      throw new UnauthorizedException('Нет прав на изменение');
    }
    return this.controlOperations.updateDispatch(dto, req.user.id);
  }

  @Patch('reminder')
  async updateReminder(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(reminderUpdate)) dto: ReminderUpdateDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    const currentReminder = await this.controlOperations.readSlimOperationById(
      dto.id,
    );

    if (
      i.cannot('update', {
        ...currentReminder,
        class: 'reminder',
      } as ControlReminderSlim) ||
      i.cannot('update', { ...dto, class: 'reminder' })
    ) {
      throw new UnauthorizedException('Нет прав на изменение');
    }
    return this.controlOperations.updateReminder(dto, req.user.id);
  }

  @Patch('reminder/mark-as-seen')
  async markRemindersAsSeen(
    @Req() req: RequestWithUserData,
    @Body('caseIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    caseIds: number[],
  ) {
    const i = defineControlAbilityFor(req.user);
    if (i.cannot('update', 'Reminder')) {
      throw new UnauthorizedException('Нет прав на изменение');
    }
    return this.controlOperations.updateRemindersByCaseIds(
      caseIds,
      req.user.id,
    );
  }

  @Patch('reminder/mark-as-done')
  async markRemindersAsDone(
    @Req() req: RequestWithUserData,
    @Body('caseIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    caseIds: number[],
  ) {
    const i = defineControlAbilityFor(req.user);
    if (i.cannot('update', 'Reminder')) {
      throw new UnauthorizedException('Нет прав на изменение');
    }
    return this.controlOperations.markRemindersAsDoneByCaseIds(
      caseIds,
      req.user.id,
    );
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

    const newApproverId =
      dto.approveStatus === 'rejected'
        ? currentOperation.authorId
        : dto?.nextApproverId ||
          req.user?.controlData?.approvers?.cases?.[0] ||
          null;

    if (
      i.cannot('set-approver', {
        ...currentOperation,
        class: 'stage',
      } as ControlStageSlim) ||
      i.cannot('set-approver', {
        ...dto,
        approverId: newApproverId,
        class: 'stage',
      })
    ) {
      Logger.warn(
        'Согласующий недоступен',
        JSON.stringify({
          currentApprover: currentOperation.payload.approverId,
          dtoApprover: newApproverId,
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
            : newApproverId === req.user.id
              ? dto.approveStatus
              : 'pending',
      },
      req.user.id,
      newApproverId,
    );
  }
}
