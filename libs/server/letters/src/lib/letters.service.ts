import { HttpService } from '@nestjs/axios';
import { CACHE_MANAGER, Cache } from '@nestjs/cache-manager';
import {
  BadRequestException,
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { firstValueFrom, map } from 'rxjs';
import { Cron } from '@nestjs/schedule';
import { parse, valid } from 'node-html-parser';
import { TelegramService } from '@urgp/server/telegram';

@Injectable()
export class LettersService {
  constructor(
    private readonly dbServise: DatabaseService,
    private readonly telegram: TelegramService,
  ) {}

  @Cron('0 */10 8-17 * * 1-5')
  public async notifyUnchangedResolutions() {
    const messateIds = await this.telegram.sendLettersUnchangedResolutions();
    this.dbServise.db.letters.updateCaseNotificationDate(messateIds);
  }
  public async notifyUnchangedResolutionsManual() {
    const messateIds = await this.telegram.sendLettersUnchangedResolutions();
    this.dbServise.db.letters.updateCaseNotificationDate(messateIds);
  }
}
