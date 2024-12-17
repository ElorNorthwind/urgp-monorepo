import {
  ControlStageSlim,
  ControlStageCreateDto,
  ControlStage,
  ControlOperationClass,
  ControlStageUpdateDto,
  ControlOperationSlim,
  UserInputApproveDto,
  ControlOperation,
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
      type: dto.type,
      doneDate: dto.doneDate,
      num: dto.num,
      description: dto.description,
      approver: dto.approver,
      approveStatus: approved ? 'approved' : 'pending',
      approveDate: approved ? toDate(new Date()) : null,
      approveBy: approved ? authorId : null,
    };
    // const q = this.pgp.as.format(cases.createStage, newStage);
    // console.log(q);
    return this.db.one(operations.createStage, newStage);
  }

  readSlimOperationById(id: number): Promise<ControlOperationSlim | null> {
    return this.db.oneOrNone(operations.readSlimOperationById, { id });
  }

  readFullOperationById(id: number): Promise<ControlOperation | null> {
    return this.db.oneOrNone(operations.readFullOperationById, { id });
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

    // const q = this.pgp.as.format(operations.readOperationsByCaseId, {
    //   id,
    //   operationClassText,
    // });
    // console.log(q);

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
      type: dto.type,
      doneDate: dto.doneDate,
      num: dto.num,
      description: dto.description,
    };

    // const q = this.pgp.as.format(operations.updateStage, updatedStage);
    // console.log(q);
    return this.db.one(operations.updateStage, updatedStage);
  }

  deleteOperation(id: number, userId: number): Promise<ControlOperationSlim> {
    return this.db.one(operations.deleteOperation, { id, userId });
  }

  approveOperation(
    dto: UserInputApproveDto,
    userId: number,
    newApprover: number | null,
  ): Promise<ControlOperationSlim> {
    const approvedOperation = {
      userId,
      newApprover,
      id: dto.id,
      approveStatus: dto.approveStatus,
      approveNotes: dto.approveNotes,
    };
    return this.db.one(operations.approveOperation, approvedOperation);
  }
}
