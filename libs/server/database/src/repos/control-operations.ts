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
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { operations } from './sql/sql';
import { toDate } from 'date-fns';

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
      approverId: dto.approverId,
      approveStatus: approved ? 'approved' : 'pending',
      approveDate: approved ? toDate(new Date()) : null,
      approveById: approved ? authorId : null,
    };
    return this.db.one(operations.createStage, newStage);
  }

  readSlimOperationById(id: number): Promise<ControlOperationSlim | null> {
    return this.db.oneOrNone(operations.readSlimOperationById, { id });
  }

  readFullOperationById(id: number): Promise<ControlOperation | null> {
    return this.db.oneOrNone(operations.readFullOperationById, { id });
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
