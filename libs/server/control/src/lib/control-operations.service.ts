import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, UsePipes } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  ApproveControlEntityDto,
  ControlStageCreateDto,
  ControlStageUpdateDto,
  DispatchCreateDto,
  ReminderCreateDto,
  DispatchUpdateDto,
  ReminderUpdateDto,
  CaseSlim,
  GET_DEFAULT_CONTROL_DUE_DATE,
  OperationFull,
  OperationSlim,
  ReadOperationDto,
  readOperationSchema,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';
import { ControlClassificatorsService } from './control-classificators.service';
import { sub } from 'date-fns';
import { ZodValidationPipe } from '@urgp/server/pipes';

@Injectable()
export class ControlOperationsService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly classificators: ControlClassificatorsService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // public async createStage(
  //   dto: ControlStageCreateDto,
  //   userId: number,
  //   approved: boolean,
  // ): Promise<OperationFull> {
  //   const createdStage = await this.dbServise.db.controlOperations.createStage(
  //     dto,
  //     userId,
  //     approved,
  //   );
  //   return this.dbServise.db.controlOperations.readFullOperationById(
  //     createdStage.id,
  //   ) as Promise<OperationFull>;
  // }

  // public async createDispatch(
  //   dto: DispatchCreateDto,
  //   userId: number,
  // ): Promise<OperationFull> {
  //   const createdDispatch =
  //     await this.dbServise.db.controlOperations.createDispatch(dto, userId);
  //   return this.dbServise.db.controlOperations.readFullOperationById(
  //     createdDispatch.id,
  //   ) as Promise<OperationFull>;
  // }

  // public async createReminder(
  //   dto: ReminderCreateDto,
  //   userId: number,
  //   seen?: boolean,
  // ): Promise<ControlReminder> {
  //   const createdReminder =
  //     await this.dbServise.db.controlOperations.createReminder(
  //       dto,
  //       userId,
  //       seen,
  //     );
  //   return this.dbServise.db.controlOperations.readFullOperationById(
  //     createdReminder.id,
  //   ) as Promise<ControlReminder>;
  // }
  // public async readSlimOperationById(
  //   id: number,
  // ): Promise<ControlOperationSlim> {
  //   return this.dbServise.db.controlOperations.readSlimOperationById(id);
  // }

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

  // public async readFullOperationById(id: number): Promise<ControlOperation> {
  //   return this.dbServise.db.controlOperations.readFullOperationById(id);
  // }

  // public async readFullOperationsByIds(
  //   ids: number[],
  // ): Promise<ControlOperation[]> {
  //   return this.dbServise.db.controlOperations.readFullOperationsByIds(ids);
  // }

  // public async readOperationsByCaseId(
  //   id: number,
  //   userId: number,
  //   operationClass?: ControlOperationClass | null,
  // ): Promise<ControlOperation[]> {
  //   return this.dbServise.db.controlOperations.readOperationsByCaseId(
  //     id,
  //     userId,
  //     operationClass,
  //   );
  // }

  // public async updateStage(
  //   dto: ControlStageUpdateDto,
  //   userId: number,
  // ): Promise<OperationFull> {
  //   const updatedStage = await this.dbServise.db.controlOperations.updateStage(
  //     dto,
  //     userId,
  //   );
  //   return this.dbServise.db.controlOperations.readFullOperationById(
  //     updatedStage.id,
  //   ) as Promise<OperationFull>;
  // }

  // public async updateDispatch(
  //   dto: DispatchUpdateDto,
  //   userId: number,
  // ): Promise<ControlDispatch> {
  //   const updatedDispatch =
  //     await this.dbServise.db.controlOperations.updateDispatch(dto, userId);
  //   return this.dbServise.db.controlOperations.readFullOperationById(
  //     updatedDispatch.id,
  //   ) as Promise<ControlDispatch>;
  // }

  // public async updateReminder(
  //   dto: ReminderUpdateDto,
  //   userId: number,
  // ): Promise<ControlReminder> {
  //   const updatedReminder =
  //     await this.dbServise.db.controlOperations.updateReminder(dto, userId);
  //   return this.dbServise.db.controlOperations.readFullOperationById(
  //     updatedReminder.id,
  // //   ) as Promise<ControlReminder>;
  // // }

  // public async updateRemindersByCaseIds(
  //   caseIds: number[],
  //   userId: number,
  // ): Promise<OperationSlim[]> {
  //   // const updatedRemnders: ControlReminderSlim[] =
  //   return this.dbServise.db.controlOperations.updateRemindersByCaseIds(
  //     caseIds,
  //     userId,
  //   );
  //   // return this.dbServise.db.controlOperations.readFullOperationsByIds(
  //   //   updatedRemnders.map((r) => r?.id),
  //   // ) as Promise<ControlReminder[]>;
  // }

  // public async markRemindersAsDoneByCaseIds(
  //   caseIds: number[],
  //   userId: number,
  // ): Promise<OperationSlim[]> {
  //   return this.dbServise.db.controlOperations.markRemindersAsDoneByCaseIds(
  //     caseIds,
  //     userId,
  //   );
  // }

  // public async deleteOperation(
  //   id: number,
  //   userId: number,
  // ): Promise<OperationFull> {
  //   const deletedOperation =
  //     await this.dbServise.db.controlOperations.deleteOperation(id, userId);
  //   return this.dbServise.db.controlOperations.readFullOperationById(
  //     deletedOperation.id,
  //   ) as Promise<OperationFull>;
  // }

  // public async approveOperation(
  //   dto: ApproveControlEntityDto,
  //   userId: number,
  //   newApproverId: number | null,
  // ): Promise<OperationFull> {
  //   const approvedOperation =
  //     await this.dbServise.db.controlOperations.approveOperation(
  //       dto,
  //       userId,
  //       newApproverId,
  //     );
  //   return this.dbServise.db.controlOperations.readFullOperationById(
  //     approvedOperation.id,
  //   ) as Promise<OperationFull>;
  // }

  // public async createDispatchesAndReminderForCase(
  //   slimCase: CaseSlim,
  //   userId: number,
  //   dueDate?: Date | string | number,
  // ) {
  //   // Список людей, которым должны уйти напоминалки
  //   let reminderList = new Map<number, string>([
  //     // [slimCase?.authorId, 'Напоминание автору заявки'],
  //   ]);

  //   // Создаем по поручению и напоминалке на каждого из исполнителей
  //   const directions = await this.classificators.getCaseDirectionTypes();

  //   // Ищем исполнителей
  //   const flatDirections = directions.flatMap((d) => d.items);
  //   const executors = slimCase.directionIds.reduce((prev, cur) => {
  //     const executor =
  //       flatDirections.find((d) => d.value === cur)?.defaultExecutorId ||
  //       undefined;
  //     return executor && !prev.includes(executor) ? [...prev, executor] : prev;
  //   }, [] as number[]);

  //   executors.forEach(async (executor) => {
  //     // await this.createDispatch(
  //     //   {
  //     //     caseId: slimCase.id,
  //     //     class: 'dispatch',
  //     //     typeId: 10,
  //     //     dueDate: dueDate || GET_DEFAULT_CONTROL_DUE_DATE(),
  //     //     description: 'Для рассмотрения по принадлежности',
  //     //     controllerId: executor,
  //     //     executorId: executor,
  //     //   },
  //     //   userId,
  //     // );
  //     // Добавляем адресата в список напоминалок
  //     reminderList.set(executor, 'Напоминание исполнителю');
  //   });

  //   const directionSubscribers =
  //     await this.classificators.getDirectionSubscribers(slimCase?.directionIds);

  //   directionSubscribers.forEach((subscriber) => {
  //     !reminderList.has(subscriber.id) &&
  //       reminderList.set(
  //         subscriber.id,
  //         'Напоминание по интересующему направлению',
  //       );
  //   });

  //   // const existingReminders = await this.readOperationsByCaseId(
  //   //   slimCase.id,
  //   //   userId,
  //   //   'reminder',
  //   // );

  //   // reminderList.forEach((value, key) => {
  //   //   !existingReminders.map((r) => r.id).includes(key) &&
  //   //     this.createReminder(
  //   //       {
  //   //         caseId: slimCase.id,
  //   //         class: 'reminder',
  //   //         typeId: 11,
  //   //         dueDate: dueDate || GET_DEFAULT_CONTROL_DUE_DATE(),
  //   //         description: value,
  //   //         observerId: key,
  //   //       },
  //   //       userId,
  //   //     );
  //   // });
  // }
  // public async createReminderForAuthor(
  //   slimCase: CaseSlim,
  //   userId: number,
  //   dueDate?: Date | string | number,
  // ) {
  //   // const existingReminders = await this.readOperationsByCaseId(
  //   //   slimCase.id,
  //   //   userId,
  //   //   'reminder',
  //   // );
  //   // !existingReminders.map((r) => r.id).includes(userId) &&
  //   //   this.createReminder(
  //   //     {
  //   //       caseId: slimCase.id,
  //   //       class: 'reminder',
  //   //       typeId: 11,
  //   //       dueDate: dueDate || GET_DEFAULT_CONTROL_DUE_DATE(),
  //   //       description: 'Напоминание автору заявки',
  //   //       observerId: userId,
  //   //     },
  //   //     userId,
  //   //     true,
  //   //   );
  // }
}
