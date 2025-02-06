import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  Inject,
  Injectable,
  Logger,
  NotFoundException,
  UsePipes,
} from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  ApproveControlEntityDto,
  CaseSlim,
  CreateOperationDto,
  EntityClasses,
  GET_DEFAULT_CONTROL_DUE_DATE,
  MarkOperationDto,
  OperationFull,
  OperationSlim,
  ReadEntityDto,
  UpdateOperationDto,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';
import { ControlClassificatorsService } from './control-classificators.service';

@Injectable()
export class ControlOperationsService {
  constructor(
    private readonly dbServise: DatabaseService,
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
    return this.readFullOperationById(createdOperationId);
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
      { operation: [id] },
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
      { operation: [id], mode: 'slim' },
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
    const updatedOperationId =
      (await this.dbServise.db.controlOperations.updateOperation(
        dto,
        updatedById,
      )) as number;
    return this.readFullOperationById(updatedOperationId);
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

  public async deleteOperation(id: number, userId: number): Promise<number> {
    return this.dbServise.db.controlOperations.deleteOperation(id, userId);
  }

  public async approveOperation(
    dto: ApproveControlEntityDto,
    userId: number,
  ): Promise<number> {
    return this.dbServise.db.controlOperations.approveOperation(dto, userId);
  }

  public async createDispatchesAndReminderForCase(
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

    // Список людей, которым должны уйти напоминалки
    let reminderList = new Map<number, string>([]);

    // Создаем по поручению и напоминалке на каждого из исполнителей
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

    controlToList.forEach(async (controlTo) => {
      reminderList.set(controlTo, 'Напоминание исполнителю');
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

    const existingReminders = (await this.readOperations({
      case: [slimCases[0].id],
      mode: 'slim',
      class: [EntityClasses.reminder],
    })) as OperationSlim[];

    reminderList.forEach((value, key) => {
      !existingReminders.map((r) => r.id).includes(key) &&
        this.createOperation(
          // TODO : вынести в конфиг лишние поля пустой операции
          {
            caseId: caseId,
            class: 'reminder',
            typeId: 11,
            approveFromId: userId,
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

  public async createReminderForAuthor(
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

    !existingReminders.map((r) => r.id).includes(userId) &&
      this.createOperation(
        {
          caseId: caseId,
          class: 'reminder',
          typeId: 11,
          approveFromId: userId,
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
  }
}
