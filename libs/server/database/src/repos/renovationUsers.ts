import {
  CasesPageFilter,
  CONTROL_THRESHOLD,
  CreateUserDto,
  GetUserByIdDto,
  GetUserByLoginDto,
  SelectOption,
  UserApproveTo,
  UserControlData,
  UserControlSettings,
  UserWithCredentials,
} from '@urgp/shared/entities';
import { IDatabase, IMain } from 'pg-promise';
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
    return reply?.data;
  }

  async getControlSettings(id: number): Promise<UserControlSettings> {
    const reply = await this.db.oneOrNone(users.getUserControlSettings, { id });
    return reply?.data;
  }

  async setControlDirections(
    id: number,
    directions: number[],
  ): Promise<UserControlSettings> {
    // const q = this.pgp.as.format(users.setUserControlDirections, {
    //   id,
    //   directions,
    // });
    // console.log(q);

    const reply = await this.db.oneOrNone(users.setUserControlDirections, {
      id,
      directions,
    });
    return reply?.data;
  }

  async setCaseFilter(
    id: number,
    filter: CasesPageFilter,
  ): Promise<UserControlSettings> {
    // const q = this.pgp.as.format(users.setUserCaseFilter, {
    //   id,
    //   filter,
    // });
    // console.log(q);

    const reply = await this.db.oneOrNone(users.setUserCaseFilter, {
      id,
      filter,
    });
    return reply?.data;
  }

  async getUserApproveTo(userId: number): Promise<UserApproveTo> {
    return this.db.any(users.getUserApproveTo, { userId });
  }

  async getControlExecutors(): Promise<SelectOption<number>[]> {
    return this.db.any(users.getControlExecutors);
  }

  async getEscalationTargets(): Promise<SelectOption<number>[]> {
    return this.db.any(users.getEscalationTargets, {
      controlThreshold: CONTROL_THRESHOLD,
    });
  }
}
