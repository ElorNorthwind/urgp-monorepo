import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import {
  UserInputApproveDto,
  ControlStageCreateDto,
  ControlOperationClass,
  ControlOperationSlim,
  ControlOperation,
  ControlStageUpdateDto,
  ControlStageSlim,
  ControlStage,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';

@Injectable()
export class ControlOperationsService {
  constructor(
    private readonly dbServise: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  // public async getOperationTypes(): Promise<NestedClassificatorInfo[]> {
  //   return this.dbServise.db.controlClassificators.readOperationTypes();
  // }

  public async createStage(
    dto: ControlStageCreateDto,
    userId: number,
    approved: boolean,
  ): Promise<ControlOperation> {
    const createdStage = await this.dbServise.db.controlOperations.createStage(
      dto,
      userId,
      approved,
    );
    return this.dbServise.db.controlOperations.readFullOperationById(
      createdStage.id,
    ) as Promise<ControlStage>;
  }

  public async readSlimOperationById(
    id: number,
  ): Promise<ControlOperationSlim> {
    return this.dbServise.db.controlOperations.readSlimOperationById(id);
  }

  public async readOperationPayloadHistory(
    id: number,
  ): Promise<Array<ControlOperation['payload'] & { id: number }>> {
    return this.dbServise.db.controlOperations.readOperationPayloadHistory(id);
  }

  public async readFullOperationById(id: number): Promise<ControlOperation> {
    return this.dbServise.db.controlOperations.readFullOperationById(id);
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
  ): Promise<ControlStage> {
    const updatedStage = await this.dbServise.db.controlOperations.updateStage(
      dto,
      userId,
    );
    return this.dbServise.db.controlOperations.readFullOperationById(
      updatedStage.id,
    ) as Promise<ControlStage>;
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
