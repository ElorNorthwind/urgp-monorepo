import { OperationFull } from '@urgp/shared/entities';
import { TelegramService } from '../telegram.service';

export const notifyStage = async (
  userId: number,
  operation: OperationFull,
  parentThis: TelegramService,
  mode: 'pending' | 'reject' = 'pending',
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
    `${mode === 'pending' ? 'Поступил [новоый проект решения]' : 'Отказано в согласовании [проекта решения]'}(${origin}/control/case?id=${operation?.caseId})\\.` +
    (parentCase?.title ? `\n**>📁 *Заявка:* ${parentCase?.title}` : '') +
    `\n**>👤 *${mode === 'pending' ? 'Направлено от' : 'Отказ от'}:* ${esc(operation?.approveFrom?.fio || '')}` +
    `\n>🧳 *Тип решения:* ${esc(operation?.type?.name || '')}` +
    (mode === 'pending' && operation?.notes && operation?.notes?.length > 0
      ? `\n**>💬 *Комментарий*: ${esc(mode === 'pending' ? operation?.notes || '' : operation?.approveNotes || '')}`
      : '') +
    (mode === 'reject' &&
    operation?.approveNotes &&
    operation?.approveNotes?.length > 0
      ? `\n**>💬 *Причина возврата*: ${esc(operation?.approveNotes)}`
      : '');

  parentThis.messageUser(userId, message, {
    parse_mode: 'MarkdownV2',
  });
};
