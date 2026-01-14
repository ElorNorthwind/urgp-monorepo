import { IDatabase, IMain } from 'pg-promise';
import { renovationSync } from './sql/sql';
import {
  RenovationSyncDatasets,
  renovationSyncDatasetsValues,
  RenovationSyncResult,
} from '../model/types';
import { Logger } from '@nestjs/common';
import {
  MessageServer,
  MessageServerCreateDto,
  MessageServerUpdateDto,
} from '@urgp/shared/entities';

// @Injectable()
export class RenovationSyncRepository {
  constructor(
    private db: IDatabase<unknown>,
    private pgp: IMain,
  ) {}

  async postUpdateResult(result: RenovationSyncResult): Promise<void> {
    let classificatorSql =
      'SELECT id, name FROM renovation.data_updates WHERE id = $1';
    const datasetName = await this.db.one(classificatorSql, [result.id]);

    let setCondition = '';
    if (result?.success) {
      setCondition =
        'updated_at = CURRENT_TIMESTAMP, last_success_update_at = CURRENT_TIMESTAMP, success = true, error_details = $1';
    } else {
      setCondition =
        'updated_at = CURRENT_TIMESTAMP, success = false, error_details = $1';
    }

    const sql = `UPDATE renovation.data_updates
    SET ${setCondition} 
    WHERE id = $2`;
    await this.db.none(sql, [result?.errorDetails ?? null, result?.id]);
    Logger.log(
      `Renovation sync dataset: ${datasetName.name}. Result: ${result?.success ? 'success' : 'failed'}`,
    );
  }

  async syncOldApartmenst(): Promise<void> {
    try {
      await this.db.none(renovationSync.oldApartmentsSync);
      this.postUpdateResult({ id: 11, success: true });
    } catch (e) {
      this.postUpdateResult({
        id: 11,
        success: false,
        errorDetails: JSON.stringify(e),
      });
    }
  }
  async syncNewApartmenst(): Promise<void> {
    try {
      await this.db.none(renovationSync.newApartmentsIdSync);
      await this.db.none(renovationSync.newApartmentsSync);
      this.postUpdateResult({ id: 12, success: true });
    } catch (e) {
      this.postUpdateResult({
        id: 12,
        success: false,
        errorDetails: JSON.stringify(e),
      });
    }
  }
  async syncOffers(): Promise<void> {
    try {
      await this.db.none(renovationSync.offerSync);
      this.postUpdateResult({ id: 13, success: true });
    } catch (e) {
      this.postUpdateResult({
        id: 13,
        success: false,
        errorDetails: JSON.stringify(e),
      });
    }
  }
  async syncOrders(): Promise<void> {
    try {
      await this.db.none(renovationSync.orderSync);
      this.postUpdateResult({ id: 14, success: true });
    } catch (e) {
      this.postUpdateResult({
        id: 14,
        success: false,
        errorDetails: JSON.stringify(e),
      });
    }
  }
  async syncContracts(): Promise<void> {
    try {
      await this.db.none(renovationSync.contractSync);
      this.postUpdateResult({ id: 15, success: true });
    } catch (e) {
      this.postUpdateResult({
        id: 15,
        success: false,
        errorDetails: JSON.stringify(e),
      });
    }
  }
  async syncNotifications(): Promise<void> {
    try {
      await this.db.none(renovationSync.notificationsSync);
      this.postUpdateResult({ id: 17, success: true });
    } catch (e) {
      this.postUpdateResult({
        id: 17,
        success: false,
        errorDetails: JSON.stringify(e),
      });
    }
  }

  async messageServerReadById(id: number): Promise<MessageServer | null> {
    return this.db.oneOrNone(renovationSync.messageServerReadById, { id });
  }
  async messageServerReadByAffairId(id: number): Promise<MessageServer[]> {
    return this.db.any(renovationSync.messageServerReadByAppartId, { id });
  }
  async messageServerReadByUserUuid(uuid: string): Promise<MessageServer[]> {
    return this.db.any(renovationSync.messageServerReadByUserUuid, { uuid });
  }
  async messageServerCreate(
    dto: MessageServerCreateDto,
  ): Promise<MessageServer> {
    return this.db.one(renovationSync.messageServerCreate, dto);
  }
  async messageServerUpdate(
    dto: MessageServerUpdateDto,
  ): Promise<MessageServer> {
    return this.db.one(renovationSync.messageServerUpdate, dto);
  }
  async messageServerDelete(id: number): Promise<MessageServer> {
    return this.db.one(renovationSync.messageServerDelete, { id });
  }
}
