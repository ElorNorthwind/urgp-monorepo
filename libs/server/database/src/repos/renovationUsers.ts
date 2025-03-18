import {
  CasesPageFilter,
  CONTROL_THRESHOLD,
  CreateUserDto,
  GetUserByIdDto,
  GetUserByLoginDto,
  NestedClassificatorInfo,
  SelectOption,
  User,
  UserApproveTo,
  UserApproveToChainData,
  UserControlData,
  UserControlSettings,
  UserNotificationSettings,
  UserTelegramStatus,
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

  async getUserToken(userId: number): Promise<string> {
    const sql = `SELECT token FROM renovation.users WHERE id = $1;`;
    return this.db.oneOrNone(sql, [userId]).then((reply) => reply?.token || '');
  }

  async getUserByToken(token: string): Promise<User | null> {
    return this.db.oneOrNone(users.getByToken, { token });
  }

  async getUserChatId(userId: number): Promise<number> {
    const sql = `SELECT telegram_chat_id as id FROM renovation.users WHERE id = $1;`;
    return this.db.oneOrNone(sql, [userId]).then((reply) => reply?.id || '');
  }

  async getUserByChatId(chatId: number): Promise<User | null> {
    return this.db.oneOrNone(users.getByTelegramChatId, { chatId });
  }

  async setUserChatId(userId: number, chatId: number): Promise<null> {
    const sql = `UPDATE renovation.users SET telegram_chat_id = $1 WHERE id = $2;`;
    return this.db.none(sql, [chatId, userId]);
  }

  async getUserTelegramStatus(
    userId: number,
  ): Promise<UserTelegramStatus | null> {
    const sql = `SELECT token, telegram_chat_id IS NOT NULL as connected FROM renovation.users WHERE id = $1`;
    return this.db.oneOrNone(sql, [userId]);
  }

  async setControlDirections(
    userId: number,
    directions: number[],
  ): Promise<UserControlSettings> {
    // const q = this.pgp.as.format(users.setUserControlDirections, {
    //   id,
    //   directions,
    // });
    // console.log(q);

    const reply = await this.db.oneOrNone(users.setUserControlDirections, {
      userId,
      directions,
    });
    return reply?.data;
  }

  async setCaseFilter(
    userId: number,
    filter: CasesPageFilter,
  ): Promise<UserControlSettings> {
    // const q = this.pgp.as.format(users.setUserCaseFilter, {
    //   id,
    //   filter,
    // });
    // console.log(q);

    const reply = await this.db.oneOrNone(users.setUserCaseFilter, {
      userId,
      filter,
    });
    return reply?.data;
  }

  async setNotificationData(
    userId: number,
    notifications: UserNotificationSettings,
  ): Promise<UserControlSettings> {
    // const q = this.pgp.as.format(users.setUserCaseFilter, {
    //   id,
    //   filter,
    // });
    // console.log(q);

    const reply = await this.db.oneOrNone(users.setUserNotificationsData, {
      userId,
      notifications,
    });
    return reply?.data;
  }

  async getUserApproveTo(userId: number): Promise<UserApproveTo> {
    return this.db.any(users.getUserApproveTo, { userId });
  }

  async getUserApproveToChains(
    userId: number,
  ): Promise<UserApproveToChainData[]> {
    return this.db.any(users.getUserApproveToChains, { userId });
  }

  async getControlExecutors(): Promise<SelectOption<number>[]> {
    return this.db.any(users.getControlExecutors);
  }

  async getEscalationTargets(): Promise<SelectOption<number>[]> {
    return this.db.any(users.getEscalationTargets, {
      controlThreshold: CONTROL_THRESHOLD,
    });
  }

  async readUserControlTo(userId: number): Promise<NestedClassificatorInfo[]> {
    return this.db.any(users.readUserControlTo, {
      userId,
    });
  }
}
