import {
  ControlStageSlim,
  ControlStageCreateDto,
  ControlStage,
  ControlOperationClass,
  ControlStageUpdateDto,
  ControlOperationSlim,
  UserInputApproveDto,
  ControlOperation,
  ControlOperationPayloadHistoryData,
  DispatchCreateDto,
  ControlDispatchSlim,
  ReminderCreateDto,
  ControlReminderSlim,
  DispatchUpdateDto,
  ReminderUpdateDto,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { operations } from './sql/sql';
import { toDate } from 'date-fns';
import { Logger } from '@nestjs/common';
import { control } from 'leaflet';

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
  ): Promise<ControlStageSlim> {
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
  ): Promise<ControlDispatchSlim> {
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
  ): Promise<ControlReminderSlim> {
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

  readSlimOperationById(id: number): Promise<ControlOperationSlim | null> {
    return this.db.oneOrNone(operations.readSlimOperationById, { id });
  }

  readFullOperationById(id: number): Promise<ControlOperation | null> {
    return this.db.oneOrNone(operations.readFullOperationById, { id });
  }

  readFullOperationsByIds(ids: number[]): Promise<ControlOperation[] | null> {
    return this.db.any(operations.readFullOperationById, {
      ids: ids.join(','),
    });
  }

  readOperationPayloadHistory(
    id: number,
  ): Promise<ControlOperationPayloadHistoryData[] | null> {
    return this.db.any(operations.readOperationPayloadHistory, { id });
  }

  readOperationsByCaseId(
    id: number,
    userId: number,
    operationClass?: ControlOperationClass | null,
  ): Promise<ControlStage[]> {
    const operationClassText =
      operationClass && typeof operationClass === 'string'
        ? this.pgp.as.format(` AND class = $1`, operationClass)
        : '';

    return this.db.any(operations.readOperationsByCaseId, {
      id,
      userId,
      operationClassText,
    });
  }

  updateStage(
    dto: ControlStageUpdateDto,
    authorId: number,
  ): Promise<ControlStageSlim> {
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
  ): Promise<ControlDispatchSlim> {
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
  ): Promise<ControlReminderSlim> {
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
  ): Promise<ControlReminderSlim[]> {
    return this.db.any(operations.updateRemindersByCaseIds, {
      caseIds: caseIds.join(','),
      authorId,
    });
  }

  deleteOperation(id: number, userId: number): Promise<ControlOperationSlim> {
    return this.db.one(operations.deleteOperation, { id, userId });
  }

  approveOperation(
    dto: UserInputApproveDto,
    userId: number,
    newApproverId: number | null,
  ): Promise<ControlOperationSlim> {
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
