import { CaseFull, OperationFull } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { TelegramService } from '../telegram.service';
import { Logger } from '@nestjs/common';

export const notifyCaseProject = async (
  userId: number,
  controlCase: CaseFull,
  parentThis: TelegramService,
  mode: 'pending' | 'reject' = 'pending',
) => {
  const canNotifyUser =
    (await parentThis.dbService.db.renovationUsers.readCanNotify(userId)) ??
    false;

  if (!userId || !canNotifyUser) return;
  const origin =
    parentThis.configService.get<string>('ORIGIN') || 'http://localhost:4200';

  // Уведомления о новом поручении поручении
  const esc = parentThis.escapeCharacters;
  const message =
    `${mode === 'pending' ? 'Поступил [новоый проект заявки]' : 'Отказано в согласовании [проекта заявки]'}(${origin}/control/case?id=${controlCase?.id})\\.` +
    (controlCase?.title
      ? `\n**>🙋‍♂️ *Заявитель:* ${esc(controlCase?.title)}`
      : '') +
    (controlCase?.extra ? `\n>🏘 *Адрес:* ${esc(controlCase?.extra)}` : '') +
    `\n>👤 *${mode === 'pending' ? 'Направлено от' : 'Отказ от'}:* ${esc(controlCase?.approveFrom?.fio || '')}` +
    (mode === 'pending' && controlCase?.notes && controlCase?.notes?.length > 0
      ? `\n**>💬 *Комментарий*: ${esc(controlCase?.notes?.length > 200 ? controlCase?.notes.replace(/\n/g, ' ').slice(0, 199) + '\.\.\.' : controlCase?.notes.replace(/\n/g, ' '))}`
      : '') +
    (mode === 'reject' &&
    controlCase?.approveNotes &&
    controlCase?.approveNotes?.length > 0
      ? `\n**>💬 *Причина возврата*: ${esc(controlCase?.approveNotes)}`
      : '');

  parentThis.messageUser(userId, message, {
    parse_mode: 'MarkdownV2',
  });
};
