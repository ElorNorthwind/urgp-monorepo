import { Injectable, Logger, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { Bot, RawApi } from 'grammy';
import { Other } from 'grammy/out/core/api';
import { formatStatusMessage } from './helpers/formatStatusMessage';
import { handleError } from './helpers/handleError';
import { replyHelpInfo } from './helpers/replyHelpInfo.command';
import { replyUserStatus } from './helpers/replyUserStatus.command';
import { connectAccount } from './helpers/connectAccount.command';

@Injectable()
export class TelegramService implements OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  public bot: Bot;

  constructor(
    private configService: ConfigService,
    readonly dbService: DatabaseService,
  ) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) throw new Error('TELEGRAM_BOT_TOKEN missing');
    this.bot = new Bot(token);
  }

  async launchBot() {
    this.registerHandlers();
    await this.bot.start();
    this.logger.log('Telegram bot started');

    await this.bot.api.setMyCommands([
      { command: 'help', description: 'Список команд' },
      { command: 'status', description: 'Статус поручений' },
    ]);
  }

  async onModuleDestroy() {
    await this.bot.stop();
  }

  public async messageUser(
    userId: number,
    text: string,
    other?: Other<RawApi, 'sendMessage', 'chat_id' | 'text'>,
  ) {
    const chatId =
      await this.dbService.db.renovationUsers.getUserChatId(userId);
    if (!chatId) {
      throw new Error('Пользователь не привязан к боту!');
    }
    return await this.bot.api
      .sendMessage(chatId, text, other)
      .then((m) => m.message_id);
  }

  public async sendUserStatus(userId: number) {
    const chatId =
      await this.dbService.db.renovationUsers.getUserChatId(userId);
    if (!chatId) {
      throw new Error('Пользователь не привязан к боту!');
    }
    const status =
      await this.dbService.db.controlCases.readUserCaseStatuses(userId);

    const totalCount =
      status.case_approve +
      status.case_rejected +
      status.case_project +
      status.operation_pprove +
      status.reminder_done +
      status.reminder_overdue +
      status.escalation +
      status.control_to_me +
      status.updated;

    if (totalCount === 0) {
      return -1;
    }

    return await this.bot.api
      .sendMessage(chatId, formatStatusMessage(status), {
        parse_mode: 'MarkdownV2',
      })
      .then((m) => m.message_id);
  }

  private registerHandlers() {
    // Command handlers
    this.bot.command('start', async (ctx) => connectAccount(ctx, this));
    this.bot.command('help', replyHelpInfo);
    this.bot.command('status', async (ctx) => replyUserStatus(ctx, this));

    // Error handling
    this.bot.catch(handleError);
  }
}
