import {
  ApproveControlEntityDto,
  OperationSlim,
  OperationFull,
  CreateOperationDto,
  UpdateOperationDto,
  MarkOperationDto,
  ReadEntityDto,
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

  readOperations(
    dto: ReadEntityDto,
    userId?: number,
  ): Promise<OperationSlim[] | OperationFull[]> {
    const {
      mode = 'full',
      class: opClass = null,
      operation: operationIds = null,
      case: caseIds = null,
      visibility = 'visible', // 'all' IS UNUSED IN THIS REPO FOR NOw
    } = dto;

    if (caseIds === null && operationIds === null)
      throw new BadRequestException(
        'Неверные параметры запроса: нужен хотя бы 1 id дела или операции',
      );

    const baseQuery =
      mode === 'slim'
        ? operations.readSlimOperation
        : operations.readFullOperation;

    const conditions: string[] = [];

    if (caseIds)
      conditions.push(
        this.pgp.as.format('o."caseId" = ANY(ARRAY[$1:list])', [caseIds]),
      );

    if (operationIds)
      conditions.push(
        this.pgp.as.format('o."id" = ANY(ARRAY[$1:list])', [operationIds]),
      );

    if (opClass)
      conditions.push(
        this.pgp.as.format(`o.class = ANY(ARRAY[$1:list])`, [dto.class]),
      );

    if (mode === 'full' && userId && visibility === 'pending')
      conditions.push(
        this.pgp.as.format(
          `o."approveStatus" = 'pending' AND o."approveTo" = $1`,
          userId,
        ),
      );

    return this.db.any(baseQuery, {
      conditions:
        'WHERE ' +
        conditions.join(' AND ') +
        ' ORDER BY o."doneDate" DESC NULLS FIRST, o."createdAt" DESC',
    }) as Promise<OperationSlim[]>;
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

  markOperation(dto: MarkOperationDto, updatedById: number): Promise<number[]> {
    const baseQuery =
      dto.mode === 'done' ? operations.markAsDone : operations.markAsSeen;

    if (!dto?.class || (!dto?.case && !dto?.operation))
      throw new BadRequestException(
        'Неверные параметры запроса: нужен класс операции + id дела или операции',
      );

    const conditions: string[] = [
      this.pgp.as.format('class = ANY(ARRAY[$1:list])', [dto.class]),
    ];

    if (dto.case)
      conditions.push(
        this.pgp.as.format('case_id = ANY(ARRAY[$1:list])', [dto.case]),
      );

    if (dto.operation)
      conditions.push(
        this.pgp.as.format('id = ANY(ARRAY[$1:list])', [dto.operation]),
      );

    return this.db.any(baseQuery, {
      conditions: conditions.join(' AND '),
      updatedById,
    }) as Promise<number[]>;
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
