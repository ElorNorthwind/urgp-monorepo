import {
  Injectable,
  OnModuleInit,
  OnModuleDestroy,
  Logger,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Telegraf } from 'telegraf';
import { message } from 'telegraf/filters';

@Injectable()
export class TelegramService implements OnModuleInit, OnModuleDestroy {
  private readonly logger = new Logger(TelegramService.name);
  public bot: Telegraf;

  constructor(private configService: ConfigService) {
    const token = this.configService.get<string>('TELEGRAM_BOT_TOKEN');
    if (!token) throw new Error('TELEGRAM_BOT_TOKEN missing');
    this.bot = new Telegraf(token);
  }

  async onModuleInit() {
    this.registerHandlers();
    await this.bot.launch();
    this.logger.log('Telegram bot started');
  }

  async onModuleDestroy() {
    await this.bot.stop();
  }

  private registerHandlers() {
    // https://t.me/urgp_bot?start=111
    this.bot.start((ctx) => ctx.reply(ctx.message.chat.id.toString()));

    // Command handlers
    // this.bot.command('start', (ctx) => ctx.reply(JSON.stringify(ctx)));
    this.bot.command('help', (ctx) =>
      ctx.reply(`Зайди же [на сайт](http://10.9.96.230/address) дружок`, {
        parse_mode: 'MarkdownV2',
      }),
    );

    // Text message handler
    this.bot.on(message('text'), (ctx) => {
      ctx.reply(`Echo: ${ctx.message.text}`);
    });

    // Error handling
    this.bot.catch((err, ctx) => {
      this.logger.error(`Error for ${ctx.updateType}`, err);
      ctx.reply('Произошла ошибка...');
    });
  }
}
