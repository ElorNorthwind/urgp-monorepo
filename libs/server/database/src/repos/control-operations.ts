import {
  ApproveControlEntityDto,
  OperationSlim,
  OperationFull,
  ReadOperationDto,
  CreateOperationDto,
  UpdateOperationDto,
  MarkOperationDto,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { operations } from './sql/sql';
import { BadRequestException, Logger } from '@nestjs/common';

// @Injectable()
export class ControlOperationsRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  createOperation(dto: CreateOperationDto, authorId: number): Promise<number> {
    return this.db.one(operations.createOperation, { ...dto, authorId });
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

  updateOperation(
    dto: UpdateOperationDto,
    updatedById: number,
  ): Promise<number> {
    return this.db.one(operations.updateOperation, { ...dto, updatedById });
  }

  markOperation(
    dto: MarkOperationDto,
    updatedById: number,
    mode: 'seen' | 'done' = 'seen',
  ): Promise<number | number[]> {
    const baseQuery =
      mode === 'done' ? operations.markAsDone : operations.markAsSeen;

    //  Отметка по массиву ID дел
    if (dto?.case && Array.isArray(dto?.case)) {
      const q = this.pgp.as.format(baseQuery, {
        conditions: this.pgp.as.format(`case_id = ANY(ARRAY[$1:list])`, [
          [dto.case],
        ]),
        updatedById,
      });
      return this.db.any(q) as Promise<number[]>;

      // Отметка по 1 ID дела
    } else if (dto?.case && typeof dto?.case === 'number') {
      const q = this.pgp.as.format(baseQuery, {
        conditions: this.pgp.as.format(`WHERE case_id = $1`, dto.case),
        updatedById,
      });
      return this.db.any(q) as Promise<number[]>;

      // Отметка по массиву ID операций
    } else if (dto?.operation && Array.isArray(dto?.operation)) {
      const q = this.pgp.as.format(baseQuery, {
        conditions: this.pgp.as.format(`WHERE id = ANY(ARRAY[$1:list])`, [
          dto.operation,
        ]),
        updatedById,
      });
      return this.db.any(q) as Promise<number[]>;

      // Отметка по 1 ID операции
    } else if (dto?.operation && typeof dto?.operation === 'number') {
      const q = this.pgp.as.format(baseQuery, {
        conditions: this.pgp.as.format(`WHERE id = $1`, dto.operation),
        updatedById,
      });
      return this.db.oneOrNone(q) as Promise<number>;
    }

    throw new BadRequestException(
      'Неверные параметры запроса: нужен хотя бы 1 id дела или операции',
    );
  }

  deleteOperation(id: number, userId: number): Promise<number> {
    return this.db.one(operations.deleteOperation, { id, userId });
  }

  approveOperation(
    dto: ApproveControlEntityDto,
    userId: number,
  ): Promise<number> {
    return this.db.one(operations.approveOperation, { dto, userId });
  }
}
