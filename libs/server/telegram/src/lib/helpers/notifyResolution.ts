import { OperationFull } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { TelegramService } from '../telegram.service';
import { Logger } from '@nestjs/common';

export const notifyResolution = async (
  userId: number,
  operation: OperationFull,
  parentThis: TelegramService,
  mode: 'new' | 'change' = 'new',
) => {
  const canNotifyUser =
    (await parentThis.dbService.db.renovationUsers.readCanNotify(userId)) ??
    false;

  const parentCase = (
    await parentThis.dbService.db.controlCases.readCases({
      mode: 'slim',
      case: [operation?.caseId],
    })
  )?.[0];

  if (!userId || !canNotifyUser) return;
  const origin =
    parentThis.configService.get<string>('ORIGIN') || 'http://localhost:4200';

  // Уведомления о новом поручении поручении
  const esc = parentThis.escapeCharacters;
  const message =
    `${mode === 'new' ? 'Поступило [новое поручение]' : 'Изменен срок [поручения]'}(${origin}/control/case?id=${operation?.caseId})\\.` +
    (parentCase?.title ? `\n**>📁 *Заявка:* ${parentCase?.title}` : '') +
    (userId === operation?.controlFrom?.id
      ? `\n**>👤 *Оставлено на Вашем контроле*`
      : `\n**>👤 *Контролирует:* ${esc(operation?.controlFrom?.fio || '')}`) +
    `\n>⏰ *Срок:* ${esc(format(operation?.dueDate || '', 'dd.MM.yyyy'))}` +
    (mode === 'new' && operation?.notes && operation?.notes?.length > 0
      ? `\n**>💬 *Комментарий*: ${esc(operation?.notes)}`
      : '') +
    (mode === 'change' && operation?.extra && operation?.extra?.length > 0
      ? `\n**>💬 *Причина изменения*: ${esc(operation?.extra)}`
      : '');

  parentThis.messageUser(userId, message, {
    parse_mode: 'MarkdownV2',
  });
};
