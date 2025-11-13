import { Injectable } from '@nestjs/common';
import { Cron } from '@nestjs/schedule';
import { DatabaseService } from '@urgp/server/database';
import { TelegramService } from '@urgp/server/telegram';

@Injectable()
export class LettersService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly telegram: TelegramService,
  ) {}

  @Cron('0 */10 8-16 * * 1-5')
  private async notifyUnchangedResolutions() {
    const messateIds = await this.telegram.sendLettersUnchangedResolutions();
    this.dbServise.db.letters.updateCaseNotificationDate(messateIds);
  }
  public async notifyUnchangedResolutionsManual() {
    const messateIds = await this.telegram.sendLettersUnchangedResolutions();
    this.dbServise.db.letters.updateCaseNotificationDate(messateIds);
  }

  @Cron('0 5,15,25,35,45,55 8-16 * * 1-5')
  private async notifyNewUrgentLetters() {
    const messateIds = await this.telegram.sendLettersNewUrgent();
    this.dbServise.db.letters.updateCaseUrgentNewNotificationDate(messateIds);
  }

  public async notifyNewUrgentLettersManual() {
    const messateIds = await this.telegram.sendLettersNewUrgent();
    this.dbServise.db.letters.updateCaseUrgentNewNotificationDate(messateIds);
  }
  @Cron('0 33 15 * * 1-5')
  private async notifyUndoneUrgentLetters() {
    await this.telegram.sendLettersUndoneUrgent();
  }
  public async notifyUndoneUrgentLettersManual() {
    await this.telegram.sendLettersUndoneUrgent();
  }
}
