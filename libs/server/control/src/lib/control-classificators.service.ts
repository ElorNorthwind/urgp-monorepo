import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  UserControlData,
  ClassificatorInfo,
  NestedClassificatorInfo,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';

@Injectable()
export class ControlClassificatorsService {
  constructor(
    private readonly dbServise: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getControlData(userId: number): Promise<UserControlData> {
    return this.dbServise.db.renovationUsers.getControlData(userId);
  }

  public async getCaseTypes(): Promise<ClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readCaseTypes();
  }

  public async getOperationTypes(): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readOperationTypes();
  }

  public async getCaseStatusTypes(): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readCaseStatusTypes();
  }

  public async getCaseDirectionTypes(): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readCaseDirectionTypes();
  }
}
