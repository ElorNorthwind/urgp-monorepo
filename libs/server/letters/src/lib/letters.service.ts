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
  public async notifyUnchangedResolutions() {
    const messateIds = await this.telegram.sendLettersUnchangedResolutions();
    this.dbServise.db.letters.updateCaseNotificationDate(messateIds);
  }
  public async notifyUnchangedResolutionsManual() {
    const messateIds = await this.telegram.sendLettersUnchangedResolutions();
    this.dbServise.db.letters.updateCaseNotificationDate(messateIds);
  }
}
