import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '@urgp/server/database';
import { Bot, GrammyError, HttpError } from 'grammy';

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

  // async onModuleInit() {
  //   this.registerHandlers();
  //   await this.bot.launch();
  //   this.logger.log('Telegram bot started');
  // }

  async launchBot() {
    this.registerHandlers();
    await this.bot.start();
    this.logger.log('Telegram bot started');
  }

  async onModuleDestroy() {
    await this.bot.stop();
  }

  private registerHandlers() {
    // https://t.me/urgp_bot?start=cef2b525-35d0-4c93-a901-2dbe906b51fe
    this.bot.command('start', async (ctx) => {
      if (
        !ctx?.match ||
        !/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/.test(
          ctx.match,
        )
      ) {
        ctx.reply(
          `Для привязки учетной записи нужен корректный токен... Пройдите по ссылке на сайте.`,
        );
        throw new Error('Некорректный токен!');
      }

      const user = await this.dbService.db.renovationUsers.getUserByToken(
        ctx.match,
      );
      if (!user?.id || !ctx?.message?.chat?.id) {
        ctx.reply(`Не найден пользователя по токену.`);
        throw new Error('Пользователь не найден токен!');
      }
      await this.dbService.db.renovationUsers.setUserChatId(
        user?.id,
        ctx.message.chat.id,
      );

      ctx.reply(`Добрый день! Учетная запись ${user?.fio} привязана.`);
    });

    // Command handlers
    // this.bot.command('start', (ctx) => ctx.reply(JSON.stringify(ctx)));
    this.bot.command('help', (ctx) =>
      ctx.reply(
        `Это бот оповещений для сервиса [Кон(троль)](http://10.9.96.230/control). У него нет команд и цели, только путь.`,
        {
          parse_mode: 'MarkdownV2',
        },
      ),
    );

    // // Text message handler
    // this.bot.on(message('text'), (ctx) => {
    //   ctx.reply(`Echo: ${ctx.message.text}`);
    // });

    // Error handling
    this.bot.catch((err) => {
      const ctx = err.ctx;
      console.error(`Error while handling update ${ctx.update.update_id}:`);
      const e = err.error;
      if (e instanceof GrammyError) {
        console.error('Error in request:', e.description);
      } else if (e instanceof HttpError) {
        console.error('Could not contact Telegram:', e);
      } else {
        console.error('Unknown error:', e);
      }
    });
  }
}
