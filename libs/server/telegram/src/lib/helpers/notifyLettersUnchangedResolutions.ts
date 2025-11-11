import { UnchangedResolution } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { TelegramService } from '../telegram.service';

export const lettersNotifyUnchangedResolutions = async (
  chatId: number,
  parentThis: TelegramService,
): Promise<number[]> => {
  const resolutions: UnchangedResolution[] =
    await parentThis.dbService.db.letters.getUnchangedResolutions();
  if (!resolutions || !resolutions.length) return [];

  // Уведомления о новом поручении поручении
  const esc = parentThis.escapeCharacters;
  const message = [
    `Перепись ожидается больше часа:`,
    ...resolutions.map(
      (r) =>
        `📁 [${esc(r?.caseNum || 'б/н')}](https://mosedo.mos.ru/document.card.php?id=${r?.edoId || 0}) \\- \\(${esc(r?.dueDate ? 'срок: ' + format(r?.dueDate, 'dd.MM.yyyy') : 'без срока')}\\) \\[${esc(r?.expert || 'нет эксперта')}\\]`,
    ),
  ].join('\n');
  try {
    await parentThis.bot.api.sendMessage(chatId, message, {
      parse_mode: 'MarkdownV2',
    });
    return resolutions.map((r) => r.id);
    // .then((m) => m.message_id);
  } catch (e) {
    parentThis.logger.error(e);
    return [];
  }
};
