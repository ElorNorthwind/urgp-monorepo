import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  ApproveControlEntityDto,
  ApproveStatus,
  CaseSlim,
  CreateOperationDto,
  EntityClasses,
  GET_DEFAULT_CONTROL_DUE_DATE,
  MarkOperationDto,
  OperationClasses,
  OperationFull,
  OperationSlim,
  ReadEntityDto,
  UpdateOperationDto,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';
import { ControlClassificatorsService } from './control-classificators.service';
import { TelegramService } from '@urgp/server/telegram';
import { endOfDay, format, isEqual } from 'date-fns';

@Injectable()
export class ControlOperationsService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly telegram: TelegramService,
    // private readonly controlCases: ControlCasesService,
    private readonly classificators: ControlClassificatorsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async createOperation(
    dto: CreateOperationDto,
    userId: number,
  ): Promise<OperationFull> {
    const createdOperationId =
      (await this.dbServise.db.controlOperations.createOperation(
        dto,
        userId,
      )) as number;

    const operation = await this.readFullOperationById(createdOperationId);

    // Уведомления о поручении
    if (
      operation?.class === OperationClasses.dispatch &&
      operation?.approveStatus === ApproveStatus.approved &&
      operation?.controlTo?.id
    ) {
      this.telegram?.sendResolutionInfo(
        operation?.controlTo?.id,
        operation,
        'new',
      );
    }

    // Уведомления о проекте на согласование
    if (
      operation?.class === OperationClasses.stage &&
      operation?.approveStatus === ApproveStatus.pending &&
      operation?.approveTo?.id
    ) {
      this.telegram?.sendStageInfo(
        operation?.approveTo?.id,
        operation,
        'pending',
      );
    }

    return operation;
  }

  public async readOperations(
    dto: ReadEntityDto,
    userId?: number,
  ): Promise<OperationSlim[] | OperationFull[]> {
    return this.dbServise.db.controlOperations.readOperations(dto, userId);
  }

  public async readFullOperationById(
    id: number,
    userId?: number,
  ): Promise<OperationFull> {
    const operations = (await this.readOperations(
      { operation: [id], visibility: 'all' },
      userId,
    )) as OperationFull[];
    if (operations.length === 0)
      throw new NotFoundException(`Операция ${id || '-'} не найдена`);
    return operations[0];
  }

  public async readSlimOperationById(
    id: number,
    userId?: number,
  ): Promise<OperationSlim> {
    const operations = (await this.readOperations(
      { operation: [id], mode: 'slim', visibility: 'all' },
      userId,
    )) as OperationSlim[];
    if (operations.length === 0)
      throw new NotFoundException(`Операция ${id || '-'} не найдена`);
    return operations[0];
  }

  public async readOperationHistory(
    id: number,
  ): Promise<Array<OperationFull & { revisionId: number }>> {
    return this.dbServise.db.controlOperations.readOperationHistory(id);
  }

  public async updateOperation(
    dto: UpdateOperationDto,
    updatedById: number,
  ): Promise<OperationFull> {
    const oldOperation = await this.readSlimOperationById(dto?.id);

    const updatedOperationId =
      (await this.dbServise.db.controlOperations.updateOperation(
        dto,
        updatedById,
      )) as number;

    const operation = await this.readFullOperationById(updatedOperationId);

    // Уведомления об изменении поручения
    if (
      operation?.class === OperationClasses.dispatch &&
      operation?.approveStatus === ApproveStatus.approved &&
      operation?.controlTo?.id &&
      // dto?.dueDate &&
      // oldOperation?.dueDate &&
      // !isEqual(endOfDay(dto?.dueDate), endOfDay(oldOperation?.dueDate))
      !isEqual(dto?.dueDate || '', oldOperation?.dueDate || '')
    ) {
      this.telegram?.sendResolutionInfo(
        operation?.controlTo?.id,
        operation,
        'change',
      );
    }

    return operation;
  }

  public async markOperation(
    dto: MarkOperationDto,
    updatedById: number,
  ): Promise<number | number[]> {
    return await this.dbServise.db.controlOperations.markOperation(
      dto,
      updatedById,
    );
  }

  public async markAsWatched(caseIds: number[], userId: number): Promise<null> {
    return await this.dbServise.db.controlOperations.markAsWatched(
      caseIds,
      userId,
    );
  }

  public async deleteOperation(
    id: number,
    userId: number,
  ): Promise<OperationSlim> {
    const deletedId = await this.dbServise.db.controlOperations.deleteOperation(
      id,
      userId,
    );
    return this.readSlimOperationById(deletedId);
  }

  public async approveOperation(
    dto: ApproveControlEntityDto, // patched with correct approve data in controller
    userId: number,
  ): Promise<OperationFull> {
    const approvedOperationId =
      await this.dbServise.db.controlOperations.approveOperation(dto, userId);

    const operation = await this.readFullOperationById(
      approvedOperationId,
      userId,
    );

    // Уведомления о проекте на согласование
    if (
      operation?.class === OperationClasses.stage &&
      operation?.approveStatus === ApproveStatus.pending &&
      operation?.approveTo?.id
    ) {
      this.telegram?.sendStageInfo(
        operation?.approveTo?.id,
        operation,
        'pending',
      );
    }

    // Уведомления об отказе в согласовании
    if (
      operation?.class === OperationClasses.stage &&
      operation?.approveStatus === ApproveStatus.rejected &&
      operation?.author?.id
    ) {
      this.telegram?.sendStageInfo(operation?.author?.id, operation, 'reject');
    }

    return operation;
  }

  public async createDispatchesAndReminderForCase(
    caseId: number,
    userId: number,
    dueDate?: string,
    manualControlToIds?: number[],
  ) {
    // Забираем дело (поскольку теперь при создании мы возвращаем только id)
    const slimCases = (await this.dbServise.db.controlCases.readCases({
      mode: 'slim',
      case: [caseId],
    })) as CaseSlim[];
    if (!slimCases || slimCases.length === 0)
      throw new NotFoundException('Дело не найдено');

    // Список людей, которым должны уйти напоминалки
    let reminderList = new Map<number, string>([]);
    // Список людей, которым должны уйти поручения
    let dispatchesList = new Map<number, string>([]);

    const directions = await this.classificators.getCaseDirectionTypes();

    // Ищем исполнителей
    const flatDirections = directions.flatMap((d) => d.items);
    const controlToList = slimCases[0]?.directionIds.reduce((prev, cur) => {
      const controlTo =
        flatDirections.find((d) => d.value === cur)?.defaultExecutorId ||
        undefined;
      return controlTo && !prev.includes(controlTo)
        ? [...prev, controlTo]
        : prev;
    }, [] as number[]);

    controlToList.forEach((controlTo) => {
      reminderList.set(controlTo, 'Напоминание исполнителю');
      dispatchesList.set(controlTo, 'Для рассмотрения по тематике управления');
    });

    manualControlToIds &&
      manualControlToIds.forEach((controlTo) => {
        dispatchesList.set(controlTo, 'Добавление контроля по ручному списку');
      });

    const directionSubscribers =
      await this.classificators.getDirectionSubscribers(
        slimCases[0]?.directionIds,
      );

    directionSubscribers.forEach((subscriber) => {
      !reminderList.has(subscriber.id) &&
        reminderList.set(
          subscriber.id,
          'Напоминание по интересующему направлению',
        );
    });

    const existingRemindersAndDispatches = (await this.readOperations({
      case: [slimCases[0].id],
      mode: 'slim',
      class: [EntityClasses.reminder, EntityClasses.dispatch],
    })) as OperationSlim[];

    reminderList.forEach((value, key) => {
      !existingRemindersAndDispatches
        .map((r) => r.controlFromId)
        .includes(key) &&
        this.createOperation(
          // TODO : вынести в конфиг лишние поля пустой операции
          {
            caseId: caseId,
            class: 'reminder',
            typeId: 11,
            // approveFromId: userId,
            approveToId: userId,
            approveStatus: 'approved',
            approveDate: new Date().toISOString(),
            approveNotes: null,
            dueDate: dueDate || GET_DEFAULT_CONTROL_DUE_DATE(),
            doneDate: null,
            controlFromId: key,
            controlToId: key,
            title: null,
            notes: value,
            extra: null,
          },
          userId,
        );
    });
    dispatchesList.forEach((value, key) => {
      !existingRemindersAndDispatches
        .map((r) => r.controlFromId)
        .includes(key) &&
        this.createOperation(
          {
            caseId: caseId,
            class: 'dispatch',
            typeId: 10,
            // approveFromId: userId,
            approveToId: userId,
            approveStatus: 'approved',
            approveDate: new Date().toISOString(),
            approveNotes: null,
            dueDate: dueDate || GET_DEFAULT_CONTROL_DUE_DATE(),
            doneDate: null,
            controlFromId: key,
            controlToId: key,
            title: null,
            notes: value,
            extra: null,
          },
          userId,
        );
    });
  }

  public async createReminderForAuthorAndApproveTo(
    caseId: number,
    userId: number,
    dueDate?: string,
  ) {
    // Забираем дело (поскольку теперь при создании мы возвращаем только id)
    const slimCases = (await this.dbServise.db.controlCases.readCases({
      mode: 'slim',
      case: [caseId],
    })) as CaseSlim[];
    if (!slimCases || slimCases.length === 0)
      throw new NotFoundException('Дело не найдено');

    const existingReminders = (await this.readOperations({
      case: [slimCases[0].id],
      mode: 'slim',
      class: [EntityClasses.reminder],
    })) as OperationSlim[];

    const approveToId =
      slimCases[0]?.approveToId === userId ||
      slimCases[0]?.approveToId === 0 ||
      !slimCases[0]?.approveToId
        ? null
        : slimCases[0]?.approveToId;

    !existingReminders.map((r) => r.id).includes(userId) &&
      this.createOperation(
        {
          caseId: caseId,
          class: 'reminder',
          typeId: 11,
          // approveFromId: userId,
          approveToId: userId,
          approveStatus: 'approved',
          approveDate: new Date().toISOString(),
          approveNotes: null,
          dueDate: dueDate || GET_DEFAULT_CONTROL_DUE_DATE(),
          doneDate: null,
          controlFromId: userId,
          controlToId: userId,
          title: null,
          notes: 'Напоминание автору заявки',
          extra: null,
        },
        userId,
      );

    !!approveToId &&
      !existingReminders.map((r) => r.id).includes(approveToId) &&
      this.createOperation(
        {
          caseId: caseId,
          class: 'reminder',
          typeId: 11,
          // approveFromId: userId,
          approveToId: userId,
          approveStatus: 'approved',
          approveDate: new Date().toISOString(),
          approveNotes: null,
          dueDate: dueDate || GET_DEFAULT_CONTROL_DUE_DATE(),
          doneDate: null,
          controlFromId: approveToId,
          controlToId: approveToId,
          title: null,
          notes: 'Напоминание согласующему заявки',
          extra: null,
        },
        userId,
      );
  }

  public async createRemindeByControlTo(
    operation: OperationFull,
    userId: number,
  ) {
    const caseId = operation?.caseId;
    const controlTo = operation?.controlTo?.id;

    if (!caseId || !controlTo) return;

    const existingReminders = (await this.readOperations({
      case: [caseId],
      mode: 'slim',
      class: [EntityClasses.reminder],
    })) as OperationSlim[];

    if (existingReminders.map((r) => r.id).includes(userId)) return;

    this.createOperation(
      {
        caseId: caseId,
        class: 'reminder',
        typeId: 11,
        // approveFromId: userId,
        approveToId: userId,
        approveStatus: 'approved',
        approveDate: new Date().toISOString(),
        approveNotes: null,
        dueDate: operation?.dueDate || GET_DEFAULT_CONTROL_DUE_DATE(),
        doneDate: null,
        controlFromId: controlTo,
        controlToId: controlTo,
        title: null,
        notes: 'Напоминание адресату поручения',
        extra: null,
      },
      userId,
    );
  }
}
