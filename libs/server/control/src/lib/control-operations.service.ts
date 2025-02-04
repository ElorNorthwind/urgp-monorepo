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
  GET_DEFAULT_CONTROL_DUE_DATE,
  MarkOperationDto,
  OperationFull,
  OperationSlim,
  ReadOperationDto,
  readOperationSchema,
  UpdateOperationDto,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';
import { ControlClassificatorsService } from './control-classificators.service';
import { sub } from 'date-fns';
import { ZodValidationPipe } from '@urgp/server/pipes';
import { ControlCaseService } from './control-cases.service';

@Injectable()
export class ControlOperationsService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly classificators: ControlClassificatorsService,
    private readonly cases: ControlCaseService,
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
    return this.dbServise.db.controlOperations.readOperation(
      { operation: createdOperationId, class: 'all' },
      'full',
    ) as Promise<OperationFull>;
  }

  public async readOperation(
    dto: ReadOperationDto,
    mode: 'full' | 'slim' = 'full',
  ): Promise<
    OperationSlim | OperationSlim[] | OperationFull | OperationFull[]
  > {
    return this.dbServise.db.controlOperations.readOperation(dto, mode);
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
    return this.dbServise.db.controlOperations.readOperation(
      { operation: updatedOperationId, class: 'all' },
      'full',
    ) as Promise<OperationFull>;
  }

  public async markOperation(
    dto: MarkOperationDto,
    updatedById: number,
    mode: 'seen' | 'done' = 'seen',
  ): Promise<number | number[]> {
    return await this.dbServise.db.controlOperations.markOperation(
      dto,
      updatedById,
      mode,
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
    const slimCase = (await this.cases.readSlimCase(caseId)) as CaseSlim;
    if (!slimCase) throw new NotFoundException('Дело не найдено');

    // Список людей, которым должны уйти напоминалки
    let reminderList = new Map<number, string>([]);

    // Создаем по поручению и напоминалке на каждого из исполнителей
    const directions = await this.classificators.getCaseDirectionTypes();

    // Ищем исполнителей
    const flatDirections = directions.flatMap((d) => d.items);
    const controlToList = slimCase?.directionIds.reduce((prev, cur) => {
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
      await this.classificators.getDirectionSubscribers(slimCase?.directionIds);

    directionSubscribers.forEach((subscriber) => {
      !reminderList.has(subscriber.id) &&
        reminderList.set(
          subscriber.id,
          'Напоминание по интересующему направлению',
        );
    });

    const existingReminders = (await this.readOperation(
      {
        case: slimCase.id,
        class: 'reminder',
      },
      'slim',
    )) as OperationSlim[];

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
    const slimCase = (await this.cases.readSlimCase(caseId)) as CaseSlim;
    if (!slimCase) throw new NotFoundException('Дело не найдено');

    const existingReminders = (await this.readOperation(
      {
        case: slimCase.id,
        class: 'reminder',
      },
      'slim',
    )) as OperationSlim[];

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
