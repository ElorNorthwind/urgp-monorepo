import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import {
  AddressSession,
  CreateAddressSessionDto,
  UpdateAddressSessionDto,
} from '@urgp/shared/entities';

@Injectable()
export class AddressSessionsService {
  constructor(
    private readonly dbServise: DatabaseService,
    private configService: ConfigService,
  ) {}

  public async createSession(
    dto: CreateAddressSessionDto,
    userId: number,
  ): Promise<number> {
    return this.dbServise.db.address.insertSession(dto, userId);
  }

  public async updateSession(
    dto: UpdateAddressSessionDto,
  ): Promise<AddressSession> {
    return this.dbServise.db.address.updateSession(dto);
  }

  public async getSessionById(id: number): Promise<AddressSession | null> {
    return this.dbServise.db.address.getSessionById(id);
  }

  public async getSessionsByUserId(userId: number): Promise<AddressSession[]> {
    return this.dbServise.db.address.getSessionsByUserId(userId);
  }

  public async deleteSession(id: number): Promise<null> {
    return this.dbServise.db.address.deleteSession(id);
  }

  public async deleteSessionsOlderThan(date: string): Promise<null> {
    return this.dbServise.db.address.deleteSessionsOlderThan(date);
  }
}
