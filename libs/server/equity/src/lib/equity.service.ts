import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  EgrnDetails,
  EquityClaim,
  EquityComplexData,
  EquityObject,
  EquityOperation,
  EquityTimeline,
  EquityTotals,
  NestedClassificatorInfo,
} from '@urgp/shared/entities';

@Injectable()
export class EquityService {
  constructor(
    private readonly dbServise: DatabaseService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  public async getObjects(): Promise<EquityObject[]> {
    return this.dbServise.db.equity.getObjects(true);
  }

  public async getObjectById(objectId: number): Promise<EquityObject | null> {
    return this.dbServise.db.equity.getObjectById(objectId);
  }

  public async getEgrnDetailsByObjectId(
    objectId: number,
  ): Promise<EgrnDetails | null> {
    return this.dbServise.db.equity.getEgrnDetailsByObjectId(objectId);
  }

  public async getClaimsByObjectId(objectId: number): Promise<EquityClaim[]> {
    return this.dbServise.db.equity.getClaimsByObjectId(objectId);
  }

  public async getOperationsByObjectId(
    objectId: number,
  ): Promise<EquityOperation[]> {
    return this.dbServise.db.equity.getOperationsByObjectId(objectId);
  }

  public async getBuildingsClassificator(): Promise<NestedClassificatorInfo[]> {
    return this.dbServise.db.equity.getBuildingsClassificator();
  }

  public async getObjectStatusClassificator(): Promise<
    NestedClassificatorInfo[]
  > {
    return this.dbServise.db.equity.getObjectStatusClassificator();
  }

  public async getObjectTypeClassificator(): Promise<
    NestedClassificatorInfo[]
  > {
    return this.dbServise.db.equity.getObjectTypeClassificator();
  }

  public async getOperationTypeClassificator(): Promise<
    NestedClassificatorInfo[]
  > {
    return this.dbServise.db.equity.getOperationTypeClassificator();
  }

  public async getEquityObjectsTotals(): Promise<EquityTotals[]> {
    return this.dbServise.db.equity.getObjectsTotals();
  }

  public async getEquityObjectsTimeline(): Promise<EquityTimeline[]> {
    return this.dbServise.db.equity.getObjectsTimeline();
  }

  public async getEquityComplexList(): Promise<EquityComplexData[]> {
    return this.dbServise.db.equity.getComplexList();
  }
}
