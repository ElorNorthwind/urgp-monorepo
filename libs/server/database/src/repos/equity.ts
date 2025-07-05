import {
  CreateEquityOperationDto,
  EgrnDetails,
  EquityClaim,
  EquityComplexData,
  EquityObject,
  EquityOperation,
  EquityTimeline,
  EquityTotals,
  NestedClassificatorInfo,
  UpdateEquityOperationDto,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
import { camelToSnakeCase } from '../lib/to-snake-case';
import { equityClassificators, equityObjects } from './sql/sql';

// @Injectable()
export class EquityRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  getObjects(showUnidentified: boolean = true): Promise<EquityObject[]> {
    const sql =
      'SELECT * FROM equity.objects_full_view' +
      (showUnidentified ? '' : ' WHERE "isIdentified" = true');

    return this.db.any(sql);
  }
  getObjectById(objectId: number): Promise<EquityObject | null> {
    const sql = 'SELECT * FROM equity.objects_full_view WHERE id = $1';
    return this.db.oneOrNone(sql, [objectId]);
  }

  getEgrnDetailsByObjectId(objectId: number): Promise<EgrnDetails | null> {
    const sql = `
      SELECT 
        id,
        egrn_title_type as "titleType",
        egrn_title_date as "titleDate",
        egrn_holder_name as "holderName",
        egrn_holder_type as "holderType",
        egrn_status as status
      FROM equity.objects
      WHERE id = $1;`;
    return this.db.oneOrNone(sql, [objectId]);
  }

  getClaimsByObjectId(objectId: number): Promise<EquityClaim[]> {
    const sql = 'SELECT * FROM equity.claims_full_view WHERE "objectId" = $1';
    return this.db.any(sql, [objectId]);
  }

  getOperationsByObjectId(objectId: number): Promise<EquityOperation[]> {
    const sql =
      'SELECT * FROM equity.operations_full_view WHERE "objectId" = $1';
    return this.db.any(sql, [objectId]);
  }

  getOperationById(operationId: number): Promise<EquityOperation | null> {
    const sql = 'SELECT * FROM equity.operations_full_view WHERE "id" = $1';
    return this.db.oneOrNone(sql, [operationId]);
  }

  getBuildingsClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(equityClassificators.readBuildingsClassificator);
  }

  getObjectStatusClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(equityClassificators.readObjectStatusClassificator);
  }

  getObjectTypeClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(equityClassificators.readObjectTypeClassificator);
  }

  getOperationTypeClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.db.any(equityClassificators.readOperationTypeClassificator);
  }

  getObjectsTotals(): Promise<EquityTotals[]> {
    return this.db.any(equityObjects.readEquityObjectsTotals);
  }

  getObjectsTimeline(): Promise<EquityTimeline[]> {
    return this.db.any(equityObjects.readEquityObjectsTimeline);
  }

  getComplexList(): Promise<EquityComplexData[]> {
    return this.db.any(equityObjects.readComplexList);
  }

  createOperation(
    userId: number,
    dto: CreateEquityOperationDto,
  ): Promise<number> {
    const columns = [{ name: 'created_by_id', prop: 'userId' }];
    Object.keys(dto)
      .filter(
        (key) =>
          ![
            'id',
            'class',
            'createdById',
            'createdAt',
            'updatedById',
            'updatedAt',
          ].includes(key),
      )
      .forEach((key) => {
        columns.push({ name: camelToSnakeCase(key), prop: key });
      });
    const operationsColumnSet = new this.pgp.helpers.ColumnSet(columns, {
      table: {
        table: 'operations',
        schema: 'equity',
      },
    });
    const insert =
      this.pgp.helpers.insert({ ...dto, userId }, operationsColumnSet) +
      ' returning id;';
    return this.db.one(insert).then((result: any) => result.id);
  }

  updateOperation(
    userId: number,
    dto: UpdateEquityOperationDto,
  ): Promise<number> {
    const columns = [
      { name: 'id', prop: 'id', cnd: true },
      { name: 'updated_at', prop: 'updatedAt' },
      { name: 'updated_by_id', prop: 'updatedById' },
    ];
    Object.keys(dto)
      .filter(
        (key) =>
          ![
            'id',
            'class',
            'createdById',
            'createdAt',
            'updatedById',
            'updatedAt',
          ].includes(key),
      )
      .forEach((key) => {
        columns.push({ name: camelToSnakeCase(key), prop: key });
      });

    const operationsColumnSet = new this.pgp.helpers.ColumnSet(columns, {
      table: {
        table: 'operations',
        schema: 'equity',
      },
    });
    const update =
      this.pgp.helpers.update(
        { ...dto, updatedById: userId, updatedAt: new Date().toISOString() },
        operationsColumnSet,
      ) + ` WHERE id = ${dto.id} RETURNING id`;

    return this.db.one(update).then((result: any) => result.id);
  }

  deleteOperation(id: number): Promise<number | null> {
    const sql = `
  DELETE
  FROM equity.operations
  WHERE id = ${id}
  RETURNING object_id;
`;
    return this.db
      .oneOrNone(sql, { id })
      .then((result) => result?.object_id || null);
  }
}
