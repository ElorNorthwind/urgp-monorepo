import { IDatabase, IMain, ColumnSet } from 'pg-promise';
import { DbUser } from '../models/types';
import { SelectRenamedColumns } from '../lib/select-renamed-columns';
import {
  ExternalCredentials,
  ExternalLookup,
  ExternalSessionInfo,
} from '@urgp/server/entities';

const table = { table: 'users', schema: 'dev' };
const userColumns = [
  { name: 'UserID', prop: 'id', cnd: true },
  { name: 'EDO_ID', prop: 'edoId', cnd: true },
  { name: 'EDO_Password', prop: 'edoPassword', cnd: true },
  { name: 'UserFIO', prop: 'fio' },
  { name: 'upr_id', prop: 'uprId' },
  { name: 'OtdelID', prop: 'otdelId' },
];

// const credentialsColumns = [
//   { name: 'user_id', prop: 'userId' },
//   { name: 'org_id', prop: 'orgId' },
//   { name: 'login', prop: 'login' },
//   { name: 'password', prop: 'password' },
//   { name: 'system', prop: 'system' },
//   { name: 'name', prop: 'name' },
//   { name: 'group_id', prop: 'groupId' },
// ];

// @Injectable()
export class UsersRepository {
  /**
   * @param db
   * Automated database connection context/interface.
   *
   * If you ever need to access other repositories from this one,
   * you will have to replace type 'IDatabase<any>' with 'any'.
   *
   * @param pgp
   * Library's root, if ever needed, like to access 'helpers'
   * or other namespaces available from the root.
   */

  private cs: ColumnSet<DbUser>;
  private columnSelector: string;

  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {
    this.cs = new pgp.helpers.ColumnSet(userColumns, {
      table,
    });

    this.columnSelector = SelectRenamedColumns(this.cs);
  }

  // Returns all user records;
  all(): Promise<DbUser[]> {
    return this.db.any(this.columnSelector);
  }

  // Returns all user records for department;
  byDepartment(uprId: number): Promise<DbUser[]> {
    return this.db.any(this.columnSelector + ' WHERE upr_id = ${uprId}', {
      uprId,
    });
  }

  // Returns user by his Id;
  byId(id: number): Promise<DbUser> {
    return this.db.one(this.columnSelector + ' WHERE "UserID" = ${id}', {
      id,
    });
  }

  // Returns user by his Id;
  byEdoId(edoId: number): Promise<DbUser> {
    return this.db.one(this.columnSelector + ' WHERE "EDO_ID" = ${edoId}', {
      edoId,
    });
  }

  // Returns user by his Id;
  credentials(
    dto: ExternalLookup,
  ): Promise<ExternalCredentials & ExternalSessionInfo> {
    return this.db.one(
      'SELECT * FROM public.find_credentials($<system>, $<userId>, $<orgId>)',
      dto,
    );
  }
}

// example: https://github.com/vitaly-t/pg-promise-demo/blob/master/TypeScript/db/repos/users.ts
