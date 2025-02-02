import {
  ControlStageCreateDto,
  ControlStageUpdateDto,
  ApproveControlEntityDto,
  DispatchCreateDto,
  ReminderCreateDto,
  DispatchUpdateDto,
  ReminderUpdateDto,
  OperationSlim,
  OperationFull,
  ReadOperationDto,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { operations } from './sql/sql';
import { toDate } from 'date-fns';
import { BadRequestException, Logger } from '@nestjs/common';

// @Injectable()
export class ControlOperationsRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  createStage(
    dto: ControlStageCreateDto,
    authorId: number,
    approved: boolean,
  ): Promise<OperationSlim> {
    const newStage = {
      authorId,
      caseId: dto.caseId,
      typeId: dto.typeId,
      doneDate: dto.doneDate,
      num: dto.num,
      description: dto.description,
      approverId: approved ? authorId : dto.approverId,
      approveStatus: approved ? 'approved' : 'pending',
      approveDate: approved ? toDate(new Date()) : null,
      approveById: approved ? authorId : null,
    };
    return this.db.one(operations.createStage, newStage);
  }

  createDispatch(
    dto: DispatchCreateDto,
    authorId: number,
  ): Promise<OperationSlim> {
    const newDispatch = {
      authorId,
      caseId: dto.caseId,
      typeId: dto.typeId || 10,
      controllerId: dto.controllerId || authorId,
      executorId: dto.executorId || authorId,
      description: dto.description,
      dueDate: dto.dueDate,
    };

    // const q = this.pgp.as.format(operations.createDispatch, newDispatch);
    // console.log(q);

    return this.db.one(operations.createDispatch, newDispatch);
  }

  createReminder(
    dto: ReminderCreateDto,
    authorId: number,
    seen?: boolean,
  ): Promise<OperationSlim> {
    const newReminder = {
      authorId,
      caseId: dto.caseId,
      typeId: dto.typeId || 11,
      observerId: dto.observerId || authorId,
      description: dto.description,
      dueDate: dto.dueDate,
      seen: seen === true ? new Date() : null,
    };
    // const q = this.pgp.as.format(operations.createReminder, newReminder);
    // Logger.log(q);

    return this.db.one(operations.createReminder, newReminder);
  }

  readOperation(
    dto: ReadOperationDto,
    mode: 'full' | 'slim' = 'full',
  ): Promise<
    OperationSlim | OperationSlim[] | OperationFull | OperationFull[]
  > {
    const baseQuery =
      mode === 'slim'
        ? operations.readSlimOperation
        : operations.readFullOperation;
    const caseIdSQL = mode === 'slim' ? 'o.case_id' : 'o."caseId"';
    const operationIdSQL = mode === 'slim' ? 'o.id' : 'o.id';
    const classSQL =
      dto.class === 'all'
        ? ''
        : this.pgp.as.format(`AND o.class = $1`, dto.class);

    //  Выборка по массиву ID дел
    if (dto?.case && Array.isArray(dto?.case)) {
      const q = this.pgp.as.format(baseQuery, {
        conditions: this.pgp.as.format(
          `WHERE ${caseIdSQL} = ANY(ARRAY[$1:list]) 
          ${classSQL}
          ORDER BY o.done_date DESC NULLS FIRST, o.created_at DESC`,
          [dto.case],
        ),
      });
      return this.db.any(q) as Promise<OperationSlim[]>;

      // Выборка по 1 ID дела
    } else if (dto?.case && typeof dto?.case === 'number') {
      const q = this.pgp.as.format(baseQuery, {
        conditions: this.pgp.as.format(
          `WHERE ${caseIdSQL} = $1 ${classSQL}`,
          dto.case,
        ),
      });
      return this.db.any(q) as Promise<OperationSlim[]>;

      // Выборка по массиву ID операций
    } else if (dto?.operation && Array.isArray(dto?.operation)) {
      const q = this.pgp.as.format(baseQuery, {
        conditions: this.pgp.as.format(
          `WHERE ${operationIdSQL} = ANY(ARRAY[$1:list]) 
          ${classSQL}
          ORDER BY o.done_date DESC NULLS FIRST, o.created_at DESC`,
          [dto.operation],
        ),
      });
      return this.db.any(q) as Promise<OperationSlim[]>;

      // Выборка по 1 ID операции
    } else if (dto?.operation && typeof dto?.operation === 'number') {
      const q = this.pgp.as.format(baseQuery, {
        conditions: this.pgp.as.format(
          `WHERE ${operationIdSQL} = $1`,
          dto.operation,
        ),
      });
      return this.db.oneOrNone(q) as Promise<OperationSlim>;
    }

    throw new BadRequestException(
      'Неверные параметры запроса: нужен хотя бы 1 id дела или операции',
    );
  }

  readOperationHistory(
    id: number,
  ): Promise<Array<OperationFull & { revisionId: number }>> {
    return this.db.any(operations.readOperationHistory, { id });
  }

  // readOperationsByCaseId(
  //   id: number,
  //   userId: number,
  //   operationClass?: OperationClass | null,
  // ): Promise<OperationFull[]> {
  //   const operationClassText =
  //     operationClass && typeof operationClass === 'string'
  //       ? this.pgp.as.format(` AND class = $1`, operationClass)
  //       : '';

  //   return this.db.any(operations.readOperationsByCaseId, {
  //     id,
  //     userId,
  //     operationClassText,
  //   });
  // }

  updateStage(
    dto: ControlStageUpdateDto,
    authorId: number,
  ): Promise<OperationSlim> {
    const updatedStage = {
      id: dto.id,
      authorId,
      doneDate: dto.doneDate,
      num: dto.num,
      description: dto.description,
    };

    return this.db.one(operations.updateStage, updatedStage);
  }
  updateDispatch(
    dto: DispatchUpdateDto,
    authorId: number,
  ): Promise<OperationSlim> {
    const updatedDispatch = {
      id: dto.id,
      authorId,
      dueDate: dto.dueDate,
      executorId: dto.executorId || authorId,
      controllerId: dto.controllerId || authorId,
      description: dto.description,
      dateDescription: dto.dateDescription,
    };

    // const q = this.pgp.as.format(operations.updateDispatch, updatedDispatch);
    // console.log(q);

    return this.db.one(operations.updateDispatch, updatedDispatch);
  }

  updateReminder(
    dto: ReminderUpdateDto,
    authorId: number,
  ): Promise<OperationSlim> {
    const updatedReminder = {
      id: dto.id,
      authorId,
      dueDate: dto.dueDate,
      doneDate: dto.doneDate,
      description: dto.description,
    };
    return this.db.one(operations.updateReminder, updatedReminder);
  }
  updateRemindersByCaseIds(
    caseIds: number[],
    authorId: number,
  ): Promise<OperationSlim[]> {
    // const q = this.pgp.as.format(operations.updateRemindersByCaseIds, {
    //   caseIds: caseIds.join(','),
    //   authorId,
    // });
    // console.log(q);
    return this.db.any(operations.updateRemindersByCaseIds, {
      caseIds: caseIds.join(','),
      authorId,
    });
  }
  markRemindersAsDoneByCaseIds(
    caseIds: number[],
    authorId: number,
  ): Promise<OperationSlim[]> {
    return this.db.any(operations.markRemindersAsDoneByCaseIds, {
      caseIds: caseIds.join(','),
      authorId,
    });
  }

  deleteOperation(id: number, userId: number): Promise<OperationSlim> {
    return this.db.one(operations.deleteOperation, { id, userId });
  }

  approveOperation(
    dto: ApproveControlEntityDto,
    userId: number,
    newApproverId: number | null,
  ): Promise<OperationSlim> {
    const approvedOperation = {
      userId,
      newApproverId,
      id: dto.id,
      approveStatus: dto.approveStatus,
      approveNotes: dto.approveNotes,
    };
    return this.db.one(operations.approveOperation, approvedOperation);
  }
}
