import { UnchangedResolution } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { TelegramService } from '../telegram.service';

export const lettersNotifyUnchangedResolutions = async (
  chatId: number,
  parentThis: TelegramService,
) => {
  const resolutions: UnchangedResolution[] =
    await parentThis.dbService.db.letters.getUnchangedResolutions();
  if (!resolutions || !resolutions.length) return;

  // Уведомления о новом поручении поручении
  const esc = parentThis.escapeCharacters;
  const message =
    `Перепись ожидается больше часа:` +
    resolutions
      .map(
        (r) =>
          `📁 [${esc(r?.caseNum || 'б/н')}](https://mosedo.mos.ru/document.card.php?id=${r?.edoId || 0}) - (${r?.dueDate ? 'срок: ' + format(r?.dueDate, 'dd.MM.yyyy') : 'без срока'}) \[${r?.expert || 'нет эксперта'}\]`,
      )
      .join('\n');

  parentThis.messageUser(chatId, message, {
    parse_mode: 'MarkdownV2',
  });
};
