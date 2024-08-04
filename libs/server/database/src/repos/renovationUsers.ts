import { IDatabase, IMain, ColumnSet } from 'pg-promise';
import { DbUser } from '../models/types';
import { SelectRenamedColumns } from '../lib/select-renamed-columns';
import {
  ExternalCredentials,
  ExternalLookup,
  ExternalSessionInfo,
} from '@urgp/server/entities';
import {
  CreateUserDto,
  GetUserByIdDto,
  GetUserByLoginDto,
  User,
  UserWithCredentials,
} from '@urgp/shared/entities';
import { users } from './sql/sql';

export class RenovationUsersRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  getUserByLogin(dto: GetUserByLoginDto): Promise<UserWithCredentials | null> {
    // const query = this.pgp.as.format(users.getByLogin, { login: dto.login });
    // console.log(query);

    return this.db.oneOrNone(users.getByLogin, { login: dto.login });
  }
  getUserById(dto: GetUserByIdDto): Promise<UserWithCredentials | null> {
    return this.db.oneOrNone(users.getById, { id: dto.id });
  }

  create(dto: CreateUserDto): Promise<UserWithCredentials> {
    // const query = this.pgp.as.format(users.create, dto);
    // console.log(query);

    return this.db.one(users.create, dto);
  }

  incrementTokenVersion(id: number): Promise<number> {
    return this.db.one(users.incrementTokenVersion, { id });
  }
}
