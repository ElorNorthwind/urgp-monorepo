import { UnchangedResolution, UrgentLetter } from '@urgp/shared/entities';
import { differenceInDays, format } from 'date-fns';
import { TelegramService } from '../telegram.service';
import { InlineKeyboard } from 'grammy';

export const lettersNotifyUrgentNewResolutions = async (
  chatId: number,
  parentThis: TelegramService,
): Promise<number[]> => {
  try {
    const urgentLetters: UrgentLetter[] =
      await parentThis.dbService.db.letters.getUrgentNewLetters();
    if (!urgentLetters || !urgentLetters.length) return [];

    // Уведомления о новом поручении поручении
    const esc = parentThis.escapeCharacters;

    const message = [
      `🚨 *Упало срочное письмо\\!* 🚨`,
      ...urgentLetters.map((l) => {
        const userData = [
          l?.expert && `Эксперт\\: *${esc(l?.expert)}*`,
          l?.user && `Писатель\\: *${esc(l?.user)}*`,
        ]
          .filter(Boolean)
          .join(' ');

        const shortNotes =
          l?.notes && l.notes.length > 100
            ? l.notes.replace(/\n/g, ' ').slice(0, 100) + '...'
            : l?.notes?.replace(/\n/g, ' ');

        return `📬 [${esc(l?.caseNum || 'б/н')}](https://mosedo.mos.ru/document.card.php?id=${l?.edoId || 0}) \\- *\\(${esc(l?.dueDate ? 'срок: ' + format(l?.dueDate, 'dd.MM.yyyy') : 'без срока')}\\)*${shortNotes ? '\n>' + esc(shortNotes) : ''}${userData ? '\n>' + userData : ''}`;
      }),
    ].join('\n\n');

    await parentThis.bot.api.sendMessage(chatId, message, {
      parse_mode: 'MarkdownV2',
    });

    return urgentLetters.map((l) => l.id);
  } catch (e) {
    parentThis.logger.error(e);
    return [];
  }
};
