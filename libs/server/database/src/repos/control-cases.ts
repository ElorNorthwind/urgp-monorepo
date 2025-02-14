import {
  CaseSlim,
  CaseFull,
  CreateCaseDto,
  UpdateCaseDto,
  EntityApproveData,
  ApproveControlEntityDto,
  ReadEntityDto,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { cases } from './sql/sql';
import { BadRequestException, Logger } from '@nestjs/common';
import { z } from 'zod';

// @Injectable()
export class ControlCasesRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  createCase(dto: CreateCaseDto, authorId: number): Promise<number> {
    return this.db
      .one(cases.createCase, {
        ...dto,
        authorId,
      })
      .then((result) => result.id);
  }

  readCases(
    dto: ReadEntityDto,
    userId?: number,
  ): Promise<CaseSlim[] | CaseFull[]> {
    const {
      mode = 'full',
      class: opClass = null,
      operation: operationIds = null,
      case: caseIds = null,
      visibility = 'visible',
    } = dto;

    const baseQuery = mode === 'slim' ? cases.readSlimCase : cases.readFullCase;

    const conditions: string[] = [];

    if (caseIds)
      conditions.push(
        this.pgp.as.format('c.id = ANY(ARRAY[$1:list]::integer[])', [caseIds]),
      );

    if (operationIds && mode === 'full') {
      conditions.push(
        this.pgp.as.format('o."operationIds" && ARRAY[$1:list]::integer[]', [
          operationIds,
        ]),
      );
    }

    if (opClass)
      conditions.push(
        this.pgp.as.format(`c.class = ANY(ARRAY[$1:list]::text[])`, [opClass]),
      );

    if (visibility === 'visible' && mode === 'full' && userId) {
      conditions.push(
        this.pgp.as.format(
          `(
            c.approve_status = 'approved' 
            OR $1 = ANY(ARRAY[c.author_id,c.approve_from_id,c.approve_to_id]::integer[]) 
           )`,
          userId,
        ),
      );
    }

    if (visibility === 'pending' && mode === 'full' && userId) {
      conditions.push(
        this.pgp.as.format(
          `(
            (c.approve_status = 'pending' AND c.approve_to_id::integer = $1)
            OR o."myPendingStage" IS NOT NULL
            OR (s.category = 'рассмотрено' AND o."myReminder" IS NOT NULL AND o."myReminder"->>'doneDate' IS NULL)
            OR (s.category <> ALL(ARRAY['рассмотрено', 'проект']::text[]) AND (o."myReminder"->>'dueDate')::date < current_date AND o."myReminder"->>'doneDate' IS NULL)
            OR c.author_id = $1 AND c.approve_status = 'rejected'
           )`,
          userId,
        ),
      );
    }

    const sortSQL = 'ORDER BY c.created_at DESC, c.id DESC';

    const q = this.pgp.as.format(baseQuery, {
      conditions: this.pgp.as.format(
        `${conditions.length > 0 ? 'AND ' : ''} ${conditions.join(' AND ')} ${sortSQL}`,
      ),
      userId,
    });
    return this.db.any(q) as Promise<CaseSlim[] | CaseFull[]>;
  }

  updateCase(dto: UpdateCaseDto, updatedById: number): Promise<number> {
    const q = this.pgp.as.format(cases.updateCase, { ...dto, updatedById });
    return this.db.one(q).then((result) => result.id);
  }
  approveCase(dto: ApproveControlEntityDto, userId: number): Promise<number> {
    // userId заменяет updated_by_id и approve_from_id
    return this.db
      .one(cases.approveCase, { ...dto, userId })
      .then((result) => result.id);
  }

  deleteCase(id: number, updatedById: number): Promise<number> {
    return this.db
      .one(cases.deleteCase, { id, updatedById })
      .then((result) => result.id);
  }
}
