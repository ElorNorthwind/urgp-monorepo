import { Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  GetOldAppartmentsDto,
  GetOldBuldingsDto,
  User,
} from '@urgp/shared/entities';

@Injectable()
export class UsersService {
  constructor(private readonly dbServise: DatabaseService) {}

  public async getAll(): Promise<User[]> {
    return [{ fio: 'test', login: 'test', id: 1, roles: ['user'] }];
  }
}
