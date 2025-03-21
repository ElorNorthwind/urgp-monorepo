import { UserCaseStatus } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { escapeMarkdownCharacters as esc } from './escapeMarkdownCharacters';

export const numericCases = (value: number) => {
  const lastLetter = value.toString().slice(-1);
  if (lastLetter === '1') {
    return `заявка`;
  } else if (['2', '3', '4'].includes(lastLetter)) {
    return `заявки`;
  } else {
    return `заявок`;
  }
};

export const numericRequire = (value: number) => {
  const lastLetter = value.toString().slice(-1);
  if (lastLetter === '1') {
    return `ожидает`;
  } else if (['2', '3', '4'].includes(lastLetter)) {
    return `ожидают`;
  } else {
    return `ожидают`;
  }
};

export const formatStatusMessage = (status: UserCaseStatus) => {
  const {
    case_approve,
    case_rejected,
    case_project,
    operation_pprove,
    reminder_done,
    reminder_overdue,
    escalation,
    control_to_me,
    updated,
  } = status;

  const needMyAttention =
    case_approve +
    case_rejected +
    case_project +
    operation_pprove +
    reminder_done +
    reminder_overdue +
    escalation +
    control_to_me;

  let messages = [
    `*\\[${esc(format(new Date(), 'dd.MM.yyyy HH:MM'))}\\] 🔩 ИС [Кон\\(троль\\)](http://10.9.96.230/control):*`,
  ];

  if (needMyAttention === 0 && updated === 0) {
    messages.push(`>😴 Нет заявок, ожидающих Вашего внимания\\.`);
    return messages.join('\n');
  } else {
    if (needMyAttention > 0) {
      messages.push(
        `>📬 [*${needMyAttention} ${numericCases(needMyAttention)}*](http://10.9.96.230/control/pending) \\- ${numericRequire(needMyAttention)} Ваших действий\\.`,
      );
    }

    if (updated > 0) {
      messages.push(
        `>👁 [*${needMyAttention} ${numericCases(needMyAttention)}*](http://10.9.96.230/control/cases?viewStatus=%5Bchanged%2Cnew%5D) \\- Вы еще не видели изменений\\.`,
      );
    }
    return messages.join('\n');
  }
};
