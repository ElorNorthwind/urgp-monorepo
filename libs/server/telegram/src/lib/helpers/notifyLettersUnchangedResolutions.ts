import { UnchangedResolution } from '@urgp/shared/entities';
import { differenceInDays, format } from 'date-fns';
import { TelegramService } from '../telegram.service';
import { InlineKeyboard } from 'grammy';

export const lettersNotifyUnchangedResolutions = async (
  chatId: number,
  parentThis: TelegramService,
): Promise<number[]> => {
  try {
    const resolutions: UnchangedResolution[] =
      await parentThis.dbService.db.letters.getUnchangedResolutions();
    if (!resolutions || !resolutions.length) return [];

    // Уведомления о новом поручении поручении
    const esc = parentThis.escapeCharacters;
    const headderMessage = `*Перепись ожидается больше часа:*`;

    // await parentThis.bot.api.sendMessage(chatId, headderMessage, {
    //   parse_mode: 'MarkdownV2',
    // });
    resolutions.map(async (r, i) => {
      setTimeout(async () => {
        const keyboard = new InlineKeyboard().text(
          'Беру в работу',
          'take_unchanged_resolution_' + r.id,
        );
        const isUrgent =
          r?.dueDate && differenceInDays(r.dueDate, new Date()) < 30;

        const replyMessage = `${r?.notifiedAt ? '📂' : '📁'} [${esc(r?.caseNum || 'б/н')}](https://mosedo.mos.ru/document.card.php?id=${r?.edoId || 0}) \\- *\\(${esc(r?.dueDate ? 'срок: ' + format(r?.dueDate, 'dd.MM.yyyy') : 'без срока')}${isUrgent ? ' ⚠️' : ''}\\)* \nПросит переписать: *${esc(r?.expert || 'Эксперт-аноним')}*${r?.notes ? '\n>' + esc(r.notes) : ''}`;
        await parentThis.bot.api.sendMessage(chatId, replyMessage, {
          parse_mode: 'MarkdownV2',
          reply_markup: keyboard,
        });
      }, i * 1000);
    });

    return resolutions.map((r) => r.id);
  } catch (e) {
    parentThis.logger.error(e);
    return [];
  }
};
