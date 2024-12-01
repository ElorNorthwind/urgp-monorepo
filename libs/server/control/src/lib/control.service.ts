import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  Case,
  CaseCreateDto,
  CreateStageDto,
  Stage,
  StageApproveStatusData,
  UserControlData,
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
}
