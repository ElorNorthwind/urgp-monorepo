import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  Case,
  CaseCreateDto,
  CaseUpdateDto,
  CaseWithStatus,
  UserControlData,
  UserInputApproveDto,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';

@Injectable()
export class ControlService {
  constructor(
    private readonly dbServise: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getControlData(userId: number): Promise<UserControlData> {
    return this.dbServise.db.renovationUsers.getControlData(userId);
  }

  public async createCase(dto: CaseCreateDto, userId: number): Promise<Case> {
    // console.log(JSON.stringify(this.dbServise.db.controlCases));
    return this.dbServise.db.controlCases.createCase(dto, userId);
  }

  public async readCaseById(id: number): Promise<Case> {
    return this.dbServise.db.controlCases.readCaseById(id);
  }

  public async readCases(): Promise<CaseWithStatus[]> {
    return this.dbServise.db.controlCases.readCases();
  }

  public async updateCase(dto: CaseUpdateDto, userId: number): Promise<Case> {
    return this.dbServise.db.controlCases.updateCase(dto, userId);
  }

  public async deleteCase(id: number, userId: number): Promise<Case> {
    return this.dbServise.db.controlCases.deleteCase(id, userId);
  }

  public async approveCase(
    dto: UserInputApproveDto,
    userId: number,
    newApprover: number | null,
  ): Promise<Case> {
    return this.dbServise.db.controlCases.approveCase(dto, userId, newApprover);
  }
}
