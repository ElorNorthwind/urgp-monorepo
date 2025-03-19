import { Logger } from '@nestjs/common';
import { BotError, Context, GrammyError, HttpError } from 'grammy';

export const handleError = (err: BotError<Context>) => {
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
};
