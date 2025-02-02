import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  UserControlData,
  NestedClassificatorInfo,
  Classificator,
  UserControlApprovers,
  SelectOption,
  NestedClassificatorInfoString,
  UserControlSettings,
  CasesPageFilter,
  OperationClass,
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

  public async getControlSettings(
    userId: number,
  ): Promise<UserControlSettings> {
    return this.dbServise.db.renovationUsers.getControlSettings(userId);
  }

  public async setControlDirections(
    userId: number,
    directions: number[],
  ): Promise<UserControlSettings> {
    return this.dbServise.db.renovationUsers.setControlDirections(
      userId,
      directions,
    );
  }

  public async setCaseFilter(
    userId: number,
    filter: CasesPageFilter,
  ): Promise<UserControlSettings> {
    return this.dbServise.db.renovationUsers.setCaseFilter(userId, filter);
  }

  public async getUserApprovers(userId: number): Promise<UserControlApprovers> {
    return this.dbServise.db.renovationUsers.getUserApprovers(userId);
  }

  public async getControlExecutors(): Promise<SelectOption<number>[]> {
    return this.dbServise.db.renovationUsers.getControlExecutors();
  }

  public async getCaseTypes(): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readCaseTypes();
  }

  public async getOperationTypes(
    operationClass?: OperationClass,
  ): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readOperationTypes(
      operationClass,
    );
  }

  public async getOperationTypesFlat(
    operationClass?: OperationClass,
  ): Promise<Classificator[]> {
    return this.dbServise.db.controlClassificators.readOperationTypesFlat(
      operationClass,
    );
  }

  public async getCaseStatusTypes(): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readCaseStatusTypes();
  }

  public async getCaseDirectionTypes(): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.controlClassificators.readCaseDirectionTypes();
  }

  public async getDepartmentTypes(): Promise<NestedClassificatorInfoString[]> {
    return this.dbServise.db.controlClassificators.readDepartmentTypes();
  }

  public async getDirectionSubscribers(
    directions: number[],
  ): Promise<Classificator[]> {
    return this.dbServise.db.controlClassificators.readDirectionSubscribers(
      directions,
    );
  }
}
