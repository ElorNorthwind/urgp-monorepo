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
  ControlStageCreateDto,
  ControlOperationClass,
  ControlOperationSlim,
  ControlOperation,
  ControlStageUpdateDto,
  ControlStageSlim,
  TypeInfo,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';

@Injectable()
export class ControlOperationsService {
  constructor(
    private readonly dbServise: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getControlData(userId: number): Promise<UserControlData> {
    return this.dbServise.db.renovationUsers.getControlData(userId);
  }

  public async getOperationTypes(): Promise<TypeInfo[]> {
    return this.dbServise.db.controlClassificators.readOperationTypes();
  }

  public async createStage(
    dto: ControlStageCreateDto,
    userId: number,
    approved: boolean,
  ): Promise<ControlOperationSlim> {
    return this.dbServise.db.controlOperations.createStage(
      dto,
      userId,
      approved,
    );
  }

  public async readOperationById(id: number): Promise<ControlOperationSlim> {
    return this.dbServise.db.controlOperations.readOperationById(id);
  }

  public async readOperationsByCaseId(
    id: number,
    userId: number,
    operationClass?: ControlOperationClass | null,
  ): Promise<ControlOperation[]> {
    return this.dbServise.db.controlOperations.readOperationsByCaseId(
      id,
      userId,
      operationClass,
    );
  }

  public async updateStage(
    dto: ControlStageUpdateDto,
    userId: number,
  ): Promise<ControlStageSlim> {
    return this.dbServise.db.controlOperations.updateStage(dto, userId);
  }

  public async deleteOperation(
    id: number,
    userId: number,
  ): Promise<ControlOperationSlim> {
    return this.dbServise.db.controlOperations.deleteOperation(id, userId);
  }

  public async approveOperation(
    dto: UserInputApproveDto,
    userId: number,
    newApprover: number | null,
  ): Promise<ControlOperationSlim> {
    return this.dbServise.db.controlOperations.approveOperation(
      dto,
      userId,
      newApprover,
    );
  }
}
