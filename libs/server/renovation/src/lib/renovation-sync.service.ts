import { Injectable } from '@nestjs/common';
import { DsaDgiService } from '@urgp/server/dsa-dgi';
import {
  MessageServer,
  MessageServerCreateDto,
  MessageServerUpdateDto,
} from '@urgp/shared/entities';

@Injectable()
export class RenovationSyncService {
  public updateRunning: boolean = false;
  constructor(private readonly dbServise: DsaDgiService) {}

  public async syncAll(): Promise<void> {
    this.updateRunning = true;
    try {
      await this.syncOldApartmenst();
      await this.syncNewApartmenst();
      await this.syncOffers();
      await this.syncOrders();
      await this.syncContracts();
      await this.syncNotifications();
    } finally {
      this.updateRunning = false;
    }
  }

  public async syncOldApartmenst(): Promise<void> {
    await this.dbServise.db.renovationSync.syncOldApartmenst();
  }

  public async syncNewApartmenst(): Promise<void> {
    await this.dbServise.db.renovationSync.syncNewApartmenst();
  }

  public async syncOffers(): Promise<void> {
    await this.dbServise.db.renovationSync.syncOffers();
  }

  public async syncOrders(): Promise<void> {
    await this.dbServise.db.renovationSync.syncOrders();
  }
  public async syncContracts(): Promise<void> {
    await this.dbServise.db.renovationSync.syncContracts();
  }
  public async syncNotifications(): Promise<void> {
    await this.dbServise.db.renovationSync.syncNotifications();
  }

  public async messageServerReadById(
    id: number,
  ): Promise<MessageServer | null> {
    return this.dbServise.db.renovationSync.messageServerReadById(id);
  }

  public async messageServerReadByAffairId(
    id: number,
  ): Promise<MessageServer[]> {
    return this.dbServise.db.renovationSync.messageServerReadByAffairId(id);
  }

  public async messageServerReadByUserUuid(
    uuid: string,
  ): Promise<MessageServer[]> {
    return this.dbServise.db.renovationSync.messageServerReadByUserUuid(uuid);
  }

  public async messageServerCreate(
    dto: MessageServerCreateDto,
  ): Promise<MessageServer> {
    return this.dbServise.db.renovationSync.messageServerCreate(dto);
  }

  public async messageServerUpdate(
    dto: MessageServerUpdateDto,
  ): Promise<MessageServer> {
    return this.dbServise.db.renovationSync.messageServerUpdate(dto);
  }

  public async messageServerDelete(id: number): Promise<MessageServer> {
    return this.dbServise.db.renovationSync.messageServerDelete(id);
  }
}
