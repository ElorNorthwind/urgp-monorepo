import { UnchangedResolution } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { TelegramService } from '../telegram.service';
import {
  CallbackQueryContext,
  CommandContext,
  Context,
  InlineKeyboard,
} from 'grammy';

export const handleTakeUnchangedResolution = async (
  ctx: CallbackQueryContext<Context>,
  parentThis: TelegramService,
): Promise<void> => {
  try {
    const data = ctx?.callbackQuery?.data;
    const caseId = parseInt(
      data?.match(/^take_unchanged_resolution_(.+)/)?.[1] ?? '0',
    );
    const userId = ctx.from.id;
    const userName =
      ctx?.from?.first_name ?? ctx?.from?.username ?? 'Пользователь без имени';
    const chatId = ctx.chatId ?? 0;
    const messageId = ctx?.msgId ?? 0;

    await parentThis.dbService.db.letters.upsertTelegramMessageRecord({
      chatId,
      messageId,
      caseId,
      messageType: 'unchangedResolution',
      replyUserId: userId,
      replyUserName: userName,
      replyDate: new Date().toISOString(),
    });

    const originalText = ctx?.msg?.text || '';
    const newText = `\n✅ Принято в работу: ${userName} (${format(new Date(), 'dd.MM.yyyy в HH:MM')})`;
    // console.log(ctx?.msg);
    await ctx.editMessageText(originalText + newText, {
      entities: [
        ...(ctx?.msg?.entities || []),
        {
          offset: originalText.length + 1,
          length: newText.length - 1,
          type: 'blockquote',
        },
      ],
      reply_markup: undefined,
    });

    await ctx.answerCallbackQuery({
      text: 'Поручение принято Вами в работу! Новых уведомлений по нему не будет.',
      show_alert: true,
    });
  } catch (e) {
    parentThis.logger.error(e);
    await ctx.answerCallbackQuery({
      text: 'Ошибка при обращении к серверу!',
      show_alert: true,
    });
  }
};
