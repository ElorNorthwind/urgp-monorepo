import { UnchangedResolution, UrgentLetter } from '@urgp/shared/entities';
import { differenceInDays, format } from 'date-fns';
import { TelegramService } from '../telegram.service';
import { InlineKeyboard } from 'grammy';

export const lettersNotifyUrgentUndoneResolutions = async (
  chatId: number,
  parentThis: TelegramService,
): Promise<number[]> => {
  try {
    const urgentLetters: UrgentLetter[] =
      await parentThis.dbService.db.letters.getUrgentUndoneLetters();
    if (!urgentLetters || !urgentLetters.length) return [];

    const esc = parentThis.escapeCharacters;
    const headderMessage = `⚠️ *Письма требуют внимания:* ⚠️`;
    const chunkSize = 5;

    for (let i = 0; i < urgentLetters.length; i += chunkSize) {
      const chunk = urgentLetters.slice(i, i + chunkSize);
      setTimeout(
        async () => {
          const message = [
            i === 0 ? headderMessage : undefined,
            ...chunk.map((l) => {
              const userData = [
                l?.expert && `Эксперт\\: *${esc(l?.expert)}*`,
                l?.user && `Писатель\\: *${esc(l?.user)}*`,
              ]
                .filter(Boolean)
                .join(' ');
              return `📥 [${esc(l?.caseNum || 'б/н')}](https://mosedo.mos.ru/document.card.php?id=${l?.edoId || 0}) \\- *\\(${esc(l?.dueDate ? 'срок: ' + format(l?.dueDate, 'dd.MM.yyyy') : 'без срока')}\\)*${userData ? '\n>' + userData : ''}${l?.notes ? '\n❌ ' + esc(l.notes) : ''}`;
            }),
          ]
            .filter(Boolean)
            .join('\n\n');
          await parentThis.bot.api.sendMessage(chatId, message, {
            parse_mode: 'MarkdownV2',
          });
        },
        (i / chunkSize) * 1000,
      );
    }
    return urgentLetters.map((l) => l.id);
  } catch (e) {
    parentThis.logger.error(e);
    return [];
  }
};
