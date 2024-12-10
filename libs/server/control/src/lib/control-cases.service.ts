import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  CaseSlim,
  CaseCreateDto,
  CaseUpdateDto,
  Case,
  UserControlData,
  UserInputApproveDto,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';

@Injectable()
export class ControlCaseService {
  constructor(
    private readonly dbServise: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getControlData(userId: number): Promise<UserControlData> {
    return this.dbServise.db.renovationUsers.getControlData(userId);
  }

  public async createCase(
    dto: CaseCreateDto,
    userId: number,
  ): Promise<CaseSlim> {
    // console.log(JSON.stringify(this.dbServise.db.controlCases));
    return this.dbServise.db.controlCases.createCase(dto, userId);
  }

  public async readCaseById(id: number): Promise<CaseSlim> {
    return this.dbServise.db.controlCases.readCaseById(id);
  }

  public async readCases(): Promise<Case[]> {
    return this.dbServise.db.controlCases.readCases();
  }

  public async updateCase(
    dto: CaseUpdateDto,
    userId: number,
  ): Promise<CaseSlim> {
    return this.dbServise.db.controlCases.updateCase(dto, userId);
  }

  public async deleteCase(id: number, userId: number): Promise<CaseSlim> {
    return this.dbServise.db.controlCases.deleteCase(id, userId);
  }

  public async approveCase(
    dto: UserInputApproveDto,
    userId: number,
    newApprover: number | null,
  ): Promise<CaseSlim> {
    return this.dbServise.db.controlCases.approveCase(dto, userId, newApprover);
  }
}
