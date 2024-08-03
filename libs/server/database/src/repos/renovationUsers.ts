import { IDatabase, IMain, ColumnSet } from 'pg-promise';
import { DbUser } from '../models/types';
import { SelectRenamedColumns } from '../lib/select-renamed-columns';
import {
  ExternalCredentials,
  ExternalLookup,
  ExternalSessionInfo,
} from '@urgp/server/entities';

export class RenovationUsersRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  //   // Returns all user records;
  //   all(): Promise<DbUser[]> {
  //     return this.db.any(this.columnSelector);
  //   }
}
