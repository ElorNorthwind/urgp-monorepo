import { CallbackQueryContext, CommandContext, Context } from 'grammy';
import { TelegramService } from '../telegram.service';
import { formatStatusMessage } from './formatStatusMessage';

export const replyUserStatus = async (
  ctx: CommandContext<Context>,
  parentThis: TelegramService,
) => {
  const user = await parentThis.dbService.db.renovationUsers.getUserByChatId(
    ctx.chatId,
  );

  if (!user || !user?.id) {
    throw new Error('Не найден пользователь!');
  }

  const status =
    await parentThis.dbService.db.controlCases.readUserCaseStatuses(user?.id);

  ctx.reply(formatStatusMessage(status), {
    parse_mode: 'MarkdownV2',
    // reply_markup: {
    //   inline_keyboard: [
    //     [
    //       {
    //         text: 'Перейти в дашборд',
    //         url: 'http://10.9.96.230/control',
    //       },
    //       {
    //         text: 'Обновить текущий статус',
    //         callback_data: 'click-status',
    //       },
    //     ],
    //   ],
    // },
  });
};
