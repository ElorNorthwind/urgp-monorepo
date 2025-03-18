import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { Bot, GrammyError, HttpError, RawApi } from 'grammy';
import { Other } from 'grammy/out/core/api';
import { formatStatusMessage } from './helpers/formatStatusMessage';
import { Cron } from '@nestjs/schedule';

@Injectable()
export class TelegramService implements OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  public bot: Bot;

  constructor(
    private configService: ConfigService,
    private readonly dbService: DatabaseService,
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
      // { command: "start", description: "Start the bot" },
      { command: 'help', description: 'Список команд' },
      { command: 'status', description: 'Статус поручений' },
    ]);
  }

  async onModuleDestroy() {
    await this.bot.stop();
  }

  // async onModuleInit() {
  //   this.registerHandlers();
  //   await this.bot.launch();
  //   this.logger.log('Telegram bot started');
  // }

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

  // @Cron('*/10 * * * * *')
  // private testNotify() {
  //   this.sendUserStatus(1);
  // }

  private registerHandlers() {
    // https://t.me/urgp_bot?start=cef2b525-35d0-4c93-a901-2dbe906b51fe
    this.bot.command('start', async (ctx) => {
      if (
        !ctx?.match ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
          ctx.match,
        )
      ) {
        throw new Error(
          'Для привязки учетной записи нужен корректный токен... Пройдите по ссылке на сайте!',
        );
      }

      const user = await this.dbService.db.renovationUsers.getUserByToken(
        ctx.match,
      );
      if (!user?.id || !ctx?.message?.chat?.id) {
        throw new Error('Не найден токен пользователя!');
      }
      await this.dbService.db.renovationUsers.setUserChatId(
        user?.id,
        ctx.message.chat.id,
      );

      ctx.reply(`Добрый день! Учетная запись ${user?.fio} привязана.`);
    });

    // Command handlers
    this.bot.command('help', (ctx) =>
      ctx.reply(
        `Это бот оповещений для сервиса [Кон\\(троль\\)](http://10.9.96.230/control)\\.
Для проверки статуса поручений используйте команду /status\\.`,
        {
          parse_mode: 'MarkdownV2',
        },
      ),
    );

    this.bot.command('status', async (ctx) => {
      const user = await this.dbService.db.renovationUsers.getUserByChatId(
        ctx.chatId,
      );

      if (!user || !user?.id) {
        throw new Error('Не найден пользователь!');
      }

      const status = await this.dbService.db.controlCases.readUserCaseStatuses(
        user?.id,
      );

      ctx.reply(formatStatusMessage(status), {
        parse_mode: 'MarkdownV2',
      });
    });

    // Error handling
    this.bot.catch((err) => {
      const ctx = err.ctx;
      Logger.error(`Error while handling update ${ctx.update.update_id}:`);
      const e = err.error;
      if (err.message) {
        ctx.reply(err.message);
      } else {
        ctx.reply(
          'Проишошла ошибка\\! \n```json\n' +
            '\n' +
            JSON.stringify(e, null, 2) +
            '\n```',
          {
            parse_mode: 'MarkdownV2',
          },
        );
      }
      if (e instanceof GrammyError) {
        Logger.error('Error in request:', e.description);
      } else if (e instanceof HttpError) {
        Logger.error('Could not contact Telegram:', e);
      } else {
        Logger.error('Unknown error:', e);
      }
    });
  }
}
