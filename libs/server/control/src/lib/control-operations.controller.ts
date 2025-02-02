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
  approveControlEntitySchema,
  ApproveControlEntityDto,
  controlStageCreate,
  ControlStageCreateDto,
  controlStageUpdate,
  ControlStageUpdateDto,
  deleteControlEntirySchema,
  DeleteControlEntityDto,
  defineControlAbilityFor,
  dispatchCreate,
  DispatchCreateDto,
  ReminderCreateDto,
  dispatchUpdate,
  DispatchUpdateDto,
  reminderUpdate,
  ReminderUpdateDto,
  reminderCreate,
  CaseFull,
  OperationFull,
  OperationSlim,
} from '@urgp/shared/entities';
import { AccessTokenGuard } from '@urgp/server/auth';
import { ControlOperationsService } from './control-operations.service';
import { ControlClassificatorsService } from './control-classificators.service';
import { ControlCaseService } from './control-cases.service';

@Controller('control/operation')
@UseGuards(AccessTokenGuard)
export class ControlOperationsController {
  constructor(
    private readonly controlOperations: ControlOperationsService,
    private readonly controlCases: ControlCaseService,
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

    if (dto?.caseId && !autoApproved && correctApproverId === req.user.id) {
      const affectedCase = (await this.controlCases.readFullCase(
        dto.caseId,
        req.user.id,
      )) as CaseFull;
      if (i.cannot('resolve', affectedCase)) {
        throw new UnauthorizedException(
          'Операция не разрешена. Решение по делу может принять только установившим высокий контроль.',
        );
      }
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
    // return this.controlOperations.createDispatch(dto, req.user.id);
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
    // return this.controlOperations.createReminder(dto, req.user.id);
  }

  // @Get(':id')
  // getOperationById(@Param('id') id: number): Promise<OperationFull> {
  //   // return this.controlOperations.readFullOperationById(id);
  // }

  // TBD
  @Get(':id/history')
  getOperationPayloadHistory(
    @Param('id') id: number,
  ): Promise<OperationFull[]> {
    return this.controlOperations.readOperationPayloadHistory(id);
  }

  // @Get('stage/by-case/:id')
  // getStagesByCaseId(
  //   @Req() req: RequestWithUserData,
  //   @Param('id') id: number,
  // ): Promise<OperationFull[]> {
  //   // Считаем дело отсмотренным, если по нему загрузились этапы
  //   // this.controlOperations.updateRemindersByCaseIds([id], req.user.id);
  //   return this.controlOperations.readOperationsByCaseId(
  //     id,
  //     req.user.id,
  //     'stage',
  //   ) as Promise<ControlStage[]>;
  // }

  // @Get('dispatch/by-case/:id')
  // getDispatchesByCaseId(
  //   @Req() req: RequestWithUserData,
  //   @Param('id') id: number,
  // ): Promise<ControlDispatch[]> {
  //   return this.controlOperations.readOperationsByCaseId(
  //     id,
  //     req.user.id,
  //     'dispatch',
  //   ) as Promise<ControlDispatch[]>;
  // }

  // @Get('reminder/by-case/:id')
  // getRemindersByCaseId(
  //   @Req() req: RequestWithUserData,
  //   @Param('id') id: number,
  // ): Promise<ControlReminder[]> {
  //   return this.controlOperations.readOperationsByCaseId(
  //     id,
  //     req.user.id,
  //     'reminder',
  //   ) as Promise<ControlReminder[]>;
  // }

  // @Patch('stage')
  // async updateStage(
  //   @Req() req: RequestWithUserData,
  //   @Body(new ZodValidationPipe(controlStageUpdate)) dto: ControlStageUpdateDto,
  // ) {
  //   const i = defineControlAbilityFor(req.user);
  //   const currentOperation = await this.controlOperations.readSlimOperationById(
  //     dto.id,
  //   ) as OperationSlim;

  //   if (
  //     i.cannot('update', {
  //       ...currentOperation,
  //       class: 'stage',
  //     } as ControlStageSlim)
  //   ) {
  //     throw new UnauthorizedException('Нет прав на изменение');
  //   }

  //   if (
  //     i.cannot('set-approver', {
  //       ...currentOperation,
  //       class: 'stage',
  //     } as ControlStageSlim)
  //   ) {
  //     Logger.warn(
  //       'Согласующий недоступен',
  //       JSON.stringify({
  //         currentApprover: currentOperation.payload.approverId,
  //         dtoApprover: dto.approverId,
  //         userFio: req.user.fio,
  //         userApprovers: req.user.controlData?.approvers?.cases,
  //       }),
  //     );
  //     throw new UnauthorizedException(
  //       'Операция не разрешена. Согласующий не доступен пользователю!',
  //     );
  //   }

  //   if (dto.approverId === req.user.id) {
  //     const affectedCase = (await this.controlCases.readFullCase(
  //       'dispatch-' + dto.id,
  //       req.user.id,
  //     )) as Case;
  //     if (affectedCase && i.cannot('resolve', affectedCase)) {
  //       throw new UnauthorizedException(
  //         'Операция не разрешена. Решение по делу может принять только установившим высокий контроль.',
  //       );
  //     }
  //   }
  //   return this.controlOperations.updateStage(dto, req.user.id);
  // }

  // @Patch('dispatch')
  // async updateDispatch(
  //   @Req() req: RequestWithUserData,
  //   @Body(new ZodValidationPipe(dispatchUpdate)) dto: DispatchUpdateDto,
  // ) {
  //   const i = defineControlAbilityFor(req.user);
  //   const currentDispatch = await this.controlOperations.readSlimOperationById(
  //     dto.id,
  //   );

  //   if (
  //     i.cannot('update', {
  //       ...currentDispatch,
  //       class: 'dispatch',
  //     } as ControlDispatchSlim) ||
  //     i.cannot('update', { ...dto, class: 'dispatch' })
  //   ) {
  //     throw new UnauthorizedException('Нет прав на изменение');
  //   }
  //   return this.controlOperations.updateDispatch(dto, req.user.id);
  // }

  // @Patch('reminder')
  // async updateReminder(
  //   @Req() req: RequestWithUserData,
  //   @Body(new ZodValidationPipe(reminderUpdate)) dto: ReminderUpdateDto,
  // ) {
  //   const i = defineControlAbilityFor(req.user);
  //   const currentReminder = (await this.controlOperations.readSlimOperationById(
  //     dto.id,
  //   )) as ControlReminderSlim;

  //   if (
  //     i.cannot('update', {
  //       ...currentReminder,
  //       class: 'reminder',
  //     } as ControlReminderSlim) ||
  //     i.cannot('update', {
  //       ...dto,
  //       observerId: req.user.id,
  //       class: 'reminder',
  //     })
  //   ) {
  //     Logger.warn(
  //       'Нет прав на изменение напоминания',
  //       JSON.stringify({
  //         currentObserver: currentReminder.payload?.observerId,
  //         dtoApprover: req.user.id,
  //         userFio: req.user.fio,
  //         current: currentReminder,
  //         new: { ...dto, observerId: req.user.id, class: 'reminder' },
  //       }),
  //     );
  //     throw new UnauthorizedException('Нет прав на изменение напоминания');
  //   }
  //   return this.controlOperations.updateReminder(dto, req.user.id);
  // }

  @Patch('mark-reminders-as-seen')
  async markRemindersAsSeen(
    @Req() req: RequestWithUserData,
    // TODO Fix me!
    // @Body('caseIds')
    @Body('caseIds', new ParseArrayPipe({ items: Number, separator: ',' }))
    caseIds: number[],
  ) {
    const i = defineControlAbilityFor(req.user);
    if (i.cannot('update', 'Reminder')) {
      throw new UnauthorizedException('Нет прав на изменение');
    }
    // return this.controlOperations.updateRemindersByCaseIds(
    //   caseIds,
    //   req.user.id,
    // );
  }

  @Patch('mark-reminders-as-done')
  async markRemindersAsDone(
    @Req() req: RequestWithUserData,
    // TODO Fix me!
    // @Body('caseIds')
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
    @Body(new ZodValidationPipe(deleteControlEntirySchema))
    dto: DeleteControlEntityDto,
  ) {
    const i = defineControlAbilityFor(req.user);
    // const currentOperation =
    //   (await this.controlOperations.readSlimOperationById(
    //     dto.id,
    //   )) as OperationSlim;

    // if (i.cannot('delete', currentOperation)) {
    //   throw new BadRequestException('Нет прав на удаление!');
    // }

    // return this.controlOperations.deleteOperation(dto.id, req.user.id);
  }

  @Patch('approve')
  async approveOperation(
    @Req() req: RequestWithUserData,
    @Body(new ZodValidationPipe(approveControlEntitySchema))
    dto: ApproveControlEntityDto,
  ) {
    //   const i = defineControlAbilityFor(req.user);
    //   const currentOperation =
    //     (await this.controlOperations.readSlimOperationById(
    //       dto.id,
    //     )) as OperationSlim;
    //   if (
    //     i.cannot('approve', {
    //       ...currentOperation,
    //       class: 'stage',
    //     })
    //   ) {
    //     throw new UnauthorizedException(
    //       'Операция не разрешена. Нет прав на редактирование!',
    //     );
    //   }
    //   const newApproverId =
    //     dto.approveStatus === 'rejected'
    //       ? currentOperation.authorId
    //       : dto?.approveToId ||
    //         req.user?.controlData?.approvers?.cases?.[0] ||
    //         null;
    //   if (
    //     i.cannot('set-approver', {
    //       ...currentOperation,
    //       class: 'stage',
    //     }) ||
    //     i.cannot('set-approver', {
    //       ...dto,
    //       approverId: newApproverId,
    //       class: 'stage',
    //     })
    //   ) {
    //     Logger.warn(
    //       'Согласующий недоступен',
    //       JSON.stringify({
    //         currentApprover: currentOperation.approveToId,
    //         dtoApprover: newApproverId,
    //         userFio: req.user.fio,
    //         userApprovers: req.user.controlData?.approvers?.cases,
    //       }),
    //     );
    //     throw new UnauthorizedException('Согласующий недоступен пользователю!');
    //   }
    //   if (newApproverId === req.user.id) {
    //     const affectedCase = currentOperation?.caseId
    //       ? ((await this.controlCases.readFullCase(
    //           currentOperation.caseId,
    //           req.user.id,
    //         )) as CaseFull)
    //       : null;
    //     if (affectedCase && i.cannot('resolve', affectedCase)) {
    //       throw new UnauthorizedException(
    //         'Операция не разрешена. Решение по делу может принять только установившим высокий контроль.',
    //       );
    //     }
    //   }
    //   return this.controlOperations.approveOperation(
    //     {
    //       ...dto,
    //       approveStatus:
    //         dto.approveStatus === 'rejected'
    //           ? 'rejected'
    //           : newApproverId === req.user.id
    //             ? dto.approveStatus
    //             : 'pending',
    //     },
    //     req.user.id,
    //     newApproverId,
    //   );
  }
}
