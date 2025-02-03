import {
  CaseSlim,
  DISPATCH_PREFIX,
  FullCaseSelector,
  SlimCaseSelector,
  CaseFull,
  CreateCaseDto,
  UpdateCaseDto,
  EntityApproveData,
  ApproveControlEntityDto,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { cases } from './sql/sql';
import { BadRequestException } from '@nestjs/common';
import { z } from 'zod';

// @Injectable()
export class ControlCasesRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  createCase(dto: CreateCaseDto, authorId: number): Promise<number> {
    return this.db.one(cases.createCase, { ...dto, authorId });
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
      return this.db.any(q) as Promise<CaseSlim[]>;
    }
    // Выборка по 1 ID
    return this.db.one(cases.readSlimCase, {
      conditions: this.pgp.as.format(`AND c.id = $1`, selector),
    }) as Promise<CaseSlim>;
  }

  readFullCase(
    selector: FullCaseSelector,
    userId: number,
  ): Promise<CaseFull[] | CaseFull> {
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
      return this.db.any(q) as Promise<CaseFull[]>;
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
      return this.db.oneOrNone(q) as Promise<CaseFull>;
    }

    // Выборка дела по ID поручения
    if (typeof selector === 'string' && selector.startsWith(DISPATCH_PREFIX)) {
      try {
        const dispatchId = z.coerce
          .number()
          .parse(selector.split(DISPATCH_PREFIX)[1]);
        const q = this.pgp.as.format(cases.readFullCase, {
          conditions: this.pgp.as.format(
            `AND o.dispatches @> '[{"id": $1}]'::jsonb`,
            dispatchId,
          ),
          userId,
        });
        return this.db.oneOrNone(q) as Promise<CaseFull>;
      } catch (e) {
        throw new BadRequestException('Некорректный ID поручения');
      }
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
      }) as Promise<CaseFull[]>;
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
    }) as Promise<CaseFull[]>;
  }
  updateCase(dto: UpdateCaseDto, updatedById: number): Promise<number> {
    return this.db.one(cases.updateCase, { dto, updatedById });
  }
  approveCase(dto: ApproveControlEntityDto, userId: number): Promise<number> {
    // userId заменяет updated_by_id и approve_from_id
    return this.db.one(cases.approveCase, { dto, userId });
  }

  deleteCase(id: number, updatedById: number): Promise<number> {
    return this.db.one(cases.deleteCase, { id, updatedById });
  }
}
