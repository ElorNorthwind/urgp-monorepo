import { Injectable } from '@nestjs/common';
import { DsaDgiService } from '@urgp/server/dsa-dgi';

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
}
