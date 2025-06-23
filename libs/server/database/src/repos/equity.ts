import { IDatabase, IMain } from 'pg-promise';

// @Injectable()
export class EquityRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}
  getObjects(showUnidentified: boolean = false): Promise<any[]> {
    const sql =
      'SELECT * FROM equity.objects_full_view' +
      (showUnidentified ? '' : ' WHERE "isIdentified" = true');

    return this.db.any(sql);
  }
  getObjectById(id: number): Promise<any> {
    const sql = 'SELECT * FROM equity.objects_full_view WHERE id = $1';
    return this.db.oneOrNone(sql, [id]);
  }

  getClaimsByObjectId(objectId: number): Promise<any[]> {
    const sql = 'SELECT * FROM equity.claims_full_view WHERE "objectId" = $1';
    return this.db.any(sql, [objectId]);
  }

  getOperationsByObjectId(objectId: number): Promise<any[]> {
    const sql =
      'SELECT * FROM equity.operations_full_view WHERE "objectId" = $1';
    return this.db.any(sql, [objectId]);
  }
}
