import {
  Case,
  CaseCreateDto,
  CaseSlim,
  CaseUpdateDto,
  CaseWithPendingInfo,
  FullCaseSelector,
  SlimCaseSelector,
  UserInputApproveDto,
} from '@urgp/shared/entities';
import { toDate } from 'date-fns';
import { IDatabase, IMain } from 'pg-promise';
import { cases } from './sql/sql';
import { Logger } from '@nestjs/common';

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

  readSlimCase(selector: SlimCaseSelector): Promise<CaseSlim[] | CaseSlim> {
    //  Выборка по массиву ID
    if (Array.isArray(selector)) {
      const q = this.pgp.as.format(cases.readSlimCase, {
        conditions: this.pgp.as.format(
          `AND c.id = ANY(ARRAY[$1:list]) 
          ORDER BY c.created_at DESC, c.id DESC`,
          [selector],
        ),
      });
      return this.db.any(q);
    }
    // Выборка по 1 ID
    return this.db.one(cases.readSlimCase, {
      conditions: this.pgp.as.format(`AND c.id = $1`, selector),
    });
  }

  readFullCase(
    selector: FullCaseSelector,
    userId: number,
  ): Promise<Case[] | Case> {
    //  Выборка по массиву ID
    if (Array.isArray(selector)) {
      const q = this.pgp.as.format(cases.readFullCase, {
        conditions: this.pgp.as.format(
          `AND c.id = ANY(ARRAY[$1]) 
        ORDER BY c.created_at DESC, c.id DESC`,
          selector,
        ),
        userId,
      });
      return this.db.any(q);
    }

    // Выборка по 1 ID
    if (typeof selector === 'number') {
      const q = this.pgp.as.format(cases.readFullCase, {
        conditions: this.pgp.as.format(
          `AND c.id = $1
        ORDER BY c.created_at DESC, c.id DESC`,
          selector,
        ),
        userId,
      });
      return this.db.one(q);
    }

    if (selector === 'pending') {
      return this.db.any(cases.readFullCase, {
        conditions: this.pgp.as.format(
          `AND (
          (c.approve_status = 'pending' AND c.approve_to_id::integer = ${userId})
          OR o."myPendingStage" IS NOT NULL
          OR (s.category = 'рассмотрено' AND o."myReminder" IS NOT NULL AND o."myReminder"->>'doneDate' IS NULL)
          OR (s.category <> ALL(ARRAY['рассмотрено', 'проект']) AND (o."myReminder"->>'dueDate')::date < current_date AND o."myReminder"->>'doneDate' IS NULL)
          OR c.author_id = $1 AND c.approve_status = 'rejected'
          )`,
          userId,
        ),
        userId,
      });
    }

    // Выборка всех дел со стандартной сортировкой
    return this.db.any(cases.readFullCase, {
      conditions: this.pgp.as.format(
        `AND c.approve_status = 'approved' 
         OR $1 = ANY(ARRAY[c.author_id,c.approve_from_id, c.approve_to_id]) 
         OR $2 
         ORDER BY c.created_at DESC, c.id DESC`,
        [userId, selector === 'all'],
      ),
      userId,
    });
  }

  readSlimCaseById(id: number): Promise<CaseSlim> {
    return this.db.one(cases.readSlimCaseById, { id });
  }

  readFullCaseById(id: number, userId: number): Promise<Case> {
    return this.db.one(cases.readFullCaseById, { id, userId });
  }

  readFullCaseByOperationId(id: number, userId: number): Promise<Case> {
    return this.db.one(cases.readFullCaseByOperationId, { id, userId });
  }

  readPendingCaseById(
    id: number,
    userId: number,
  ): Promise<CaseWithPendingInfo> {
    return this.db.one(cases.readPendingCaseById, { id, userId });
  }

  readCases(userId: number, readAll: boolean): Promise<Case[]> {
    return this.db.any(cases.readCases, { userId, readAll });
  }

  readPendingCases(userId: number): Promise<CaseWithPendingInfo[]> {
    return this.db.any(cases.readPendingCases, { userId });
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
