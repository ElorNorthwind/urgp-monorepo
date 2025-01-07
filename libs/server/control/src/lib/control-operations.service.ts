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
  ControlStage,
  ControlOperationPayloadHistoryData,
  DispatchCreateDto,
  ControlDispatch,
  ReminderCreateDto,
  ControlReminder,
  DispatchUpdateDto,
  ReminderUpdateDto,
  ControlReminderSlim,
} from '@urgp/shared/entities';
import { Cache } from 'cache-manager';

@Injectable()
export class ControlOperationsService {
  constructor(
    private readonly dbServise: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

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

  public async createDispatch(
    dto: DispatchCreateDto,
    userId: number,
  ): Promise<ControlDispatch> {
    const createdDispatch =
      await this.dbServise.db.controlOperations.createDispatch(dto, userId);
    return this.dbServise.db.controlOperations.readFullOperationById(
      createdDispatch.id,
    ) as Promise<ControlDispatch>;
  }

  public async createReminder(
    dto: ReminderCreateDto,
    userId: number,
  ): Promise<ControlReminder> {
    const createdReminder =
      await this.dbServise.db.controlOperations.createReminder(dto, userId);
    return this.dbServise.db.controlOperations.readFullOperationById(
      createdReminder.id,
    ) as Promise<ControlReminder>;
  }
  public async readSlimOperationById(
    id: number,
  ): Promise<ControlOperationSlim> {
    return this.dbServise.db.controlOperations.readSlimOperationById(id);
  }

  public async readOperationPayloadHistory(
    id: number,
  ): Promise<ControlOperationPayloadHistoryData[]> {
    return this.dbServise.db.controlOperations.readOperationPayloadHistory(id);
  }

  public async readFullOperationById(id: number): Promise<ControlOperation> {
    return this.dbServise.db.controlOperations.readFullOperationById(id);
  }

  public async readFullOperationsByIds(
    ids: number[],
  ): Promise<ControlOperation[]> {
    return this.dbServise.db.controlOperations.readFullOperationsByIds(ids);
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

  public async updateDispatch(
    dto: DispatchUpdateDto,
    userId: number,
  ): Promise<ControlDispatch> {
    const updatedDispatch =
      await this.dbServise.db.controlOperations.updateDispatch(dto, userId);
    return this.dbServise.db.controlOperations.readFullOperationById(
      updatedDispatch.id,
    ) as Promise<ControlDispatch>;
  }

  public async updateReminder(
    dto: ReminderUpdateDto,
    userId: number,
  ): Promise<ControlReminder> {
    const updatedReminder =
      await this.dbServise.db.controlOperations.updateReminder(dto, userId);
    return this.dbServise.db.controlOperations.readFullOperationById(
      updatedReminder.id,
    ) as Promise<ControlReminder>;
  }

  public async updateRemindersByCaseIds(
    caseIds: number[],
    userId: number,
  ): Promise<ControlReminder[]> {
    try {
      const updatedRemnders: ControlReminderSlim[] =
        await this.dbServise.db.controlOperations.updateRemindersByCaseIds(
          caseIds,
          userId,
        );
      return this.dbServise.db.controlOperations.readFullOperationsByIds(
        updatedRemnders.map((r) => r.id),
      ) as Promise<ControlReminder[]>;
    } catch (e) {
      Logger.error(e);
      return [];
    }
  }

  public async deleteOperation(
    id: number,
    userId: number,
  ): Promise<ControlOperation> {
    const deletedOperation =
      await this.dbServise.db.controlOperations.deleteOperation(id, userId);
    return this.dbServise.db.controlOperations.readFullOperationById(
      deletedOperation.id,
    ) as Promise<ControlOperation>;
  }

  public async approveOperation(
    dto: UserInputApproveDto,
    userId: number,
    newApproverId: number | null,
  ): Promise<ControlOperation> {
    const approvedOperation =
      await this.dbServise.db.controlOperations.approveOperation(
        dto,
        userId,
        newApproverId,
      );
    return this.dbServise.db.controlOperations.readFullOperationById(
      approvedOperation.id,
    ) as Promise<ControlOperation>;
  }
}
