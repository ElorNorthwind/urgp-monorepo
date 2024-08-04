import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import { GetUserByLoginDto, User } from '@urgp/shared/entities';

@Injectable()
export class UsersService {
  constructor(private readonly dbServise: DatabaseService) {}

  public getUserByLogin(dto: GetUserByLoginDto): Promise<User> {
    return this.dbServise.db.renovationUsers.getByLogin(dto);
  }

  public async getAll(): Promise<User[]> {
    return [{ fio: 'test', login: 'test', id: 1, roles: ['user'] }];
  }
}
