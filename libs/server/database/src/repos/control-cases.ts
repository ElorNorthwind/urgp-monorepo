import {
  CaseSlim,
  CaseCreateDto,
  CaseUpdateDto,
  Case,
  UserInputApproveDto,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { cases } from './sql/sql';
import { toDate } from 'date-fns';

// @Injectable()
export class ControlCasesRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  createCase(
    dto: CaseCreateDto,
    authorId: number,
    approved: boolean,
  ): Promise<CaseSlim> {
    const externalCases =
      `jsonb_build_array(` +
      dto.externalCases
        .map((c) => {
          return this.pgp.as.format(
            `jsonb_build_object('id', $1, 'num', $2, 'date', $3, 'system', $4)`,
            [c.id, c.num, c.date, c.system],
          );
        })
        .join(', ') +
      `)`;
    const directionIds = this.pgp.as.format(`jsonb_build_array($1:list)`, [
      dto.directionIds,
    ]);
    const problemIds = this.pgp.as.format(`jsonb_build_array($1:list)`, [
      dto.problemIds,
    ]);

    const newCase = {
      authorId,
      externalCases,
      typeId: dto.typeId,
      directionIds,
      problemIds,
      description: dto.description,
      fio: dto.fio,
      adress: dto.adress,
      approverId: dto.approverId,
      approveStatus: approved ? 'approved' : 'pending',
      approveDate: approved ? toDate(new Date()) : null,
      approveById: approved ? authorId : null,
    };

    return this.db.one(cases.createCase, newCase);
  }

  readSlimCaseById(id: number): Promise<CaseSlim> {
    return this.db.one(cases.readSlimCaseById, { id });
  }

  readFullCaseById(id: number, userId: number): Promise<Case> {
    return this.db.one(cases.readFullCaseById, { id, userId });
  }

  readCases(userId: number, readAll: boolean): Promise<Case[]> {
    return this.db.any(cases.readCases, { userId, readAll });
  }
  updateCase(dto: CaseUpdateDto, userId: number): Promise<CaseSlim> {
    const externalCases =
      `jsonb_build_array(` +
      (dto.externalCases || [])
        .map((c) => {
          return this.pgp.as.format(
            `jsonb_build_object('id', $1, 'num', $2, 'date', $3, 'system', $4)`,
            [c.id, c.num, c.date, c.system],
          );
        })
        .join(', ') +
      `)`;
    const directionIds = this.pgp.as.format(`jsonb_build_array($1:list)`, [
      dto.directionIds,
    ]);
    const problemIds = this.pgp.as.format(`jsonb_build_array($1:list)`, [
      dto.problemIds,
    ]);

    const updatedCase = {
      id: dto.id,
      userId,
      externalCases,
      typeId: dto.typeId,
      directionIds,
      problemIds,
      description: dto.description,
      fio: dto.fio,
      adress: dto.adress,
      approverId: dto.approverId,
    };

    return this.db.one(cases.updateCase, updatedCase);
  }

  deleteCase(id: number, userId: number): Promise<CaseSlim> {
    return this.db.one(cases.deleteCase, { id, userId });
  }

  approveCase(
    dto: UserInputApproveDto,
    userId: number,
    newApproverId: number | null,
  ): Promise<CaseSlim> {
    const approvedCase = {
      userId,
      newApproverId,
      id: dto.id,
      approveStatus: dto.approveStatus,
      approveNotes: dto.approveNotes,
    };
    return this.db.one(cases.approveCase, approvedCase);
  }
}
