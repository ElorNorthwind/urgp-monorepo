import { Inject, Injectable } from '@nestjs/common';
import { DatabaseService } from '@urgp/server/database';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import {
  EquityClaim,
  EquityObject,
  EquityOperation,
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

  public async getClaimsByObjectId(objectId: number): Promise<EquityClaim[]> {
    return this.dbServise.db.equity.getClaimsByObjectId(objectId);
  }

  public async getOperationsByObjectId(
    objectId: number,
  ): Promise<EquityOperation[]> {
    return this.dbServise.db.equity.getOperationsByObjectId(objectId);
  }
}
