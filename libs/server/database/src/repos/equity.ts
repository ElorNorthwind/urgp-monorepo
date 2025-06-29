import {
  EquityClaim,
  EquityObject,
  EquityOperation,
  EquityTotals,
  NestedClassificatorInfo,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
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

  getClaimsByObjectId(objectId: number): Promise<EquityClaim[]> {
    const sql = 'SELECT * FROM equity.claims_full_view WHERE "objectId" = $1';
    return this.db.any(sql, [objectId]);
  }

  getOperationsByObjectId(objectId: number): Promise<EquityOperation[]> {
    const sql =
      'SELECT * FROM equity.operations_full_view WHERE "objectId" = $1';
    return this.db.any(sql, [objectId]);
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
}
