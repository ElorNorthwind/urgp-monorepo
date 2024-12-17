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
  UserControlApprovers,
  UserControlData,
  UserWithCredentials,
} from '@urgp/shared/entities';
import { users } from './sql/sql';

export class RenovationUsersRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  getByLogin(dto: GetUserByLoginDto): Promise<UserWithCredentials | null> {
    // const query = this.pgp.as.format(users.getByLogin, { login: dto.login });
    // console.log(query);

    return this.db.oneOrNone(users.getByLogin, { login: dto.login });
  }
  getById(dto: GetUserByIdDto): Promise<UserWithCredentials | null> {
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

  changePassword(id: number, password: string): Promise<null> {
    return this.db.none(users.changePassword, { id, password });
  }

  async getControlData(id: number): Promise<UserControlData> {
    const reply = await this.db.oneOrNone(users.getUserControlData, { id });
    return reply.data;
  }

  async getUserApprovers(id: number): Promise<UserControlApprovers> {
    return this.db.one(users.getUserApprovers, { id });
  }
}
