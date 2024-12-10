import {
  ControlStageSlim,
  ControlStageCreateDto,
  ControlStage,
  ControlOperationClass,
  ControlStageUpdateDto,
  ControlOperationSlim,
  UserInputApproveDto,
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
      problemId: dto.problemId,
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

  readOperationById(id: number): Promise<ControlOperationSlim> {
    return this.db.one(operations.readOperationById, { id });
  }

  readOperationsByCaseId(
    id: number,
    operationClass?: ControlOperationClass | null,
  ): Promise<ControlStage[]> {
    const operationClassText =
      operationClass && typeof operationClass === 'string'
        ? this.pgp.as.format(` AND class = '$1'`, operationClass)
        : '';
    return this.db.one(operations.readOperationsByCaseId, {
      id,
      operationClassText,
    });
  }

  updateStage(
    dto: ControlStageUpdateDto,
    authorId: number,
  ): Promise<ControlStageSlim> {
    const updatedStage = {
      authorId,
      type: dto.type,
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
