import { Row } from '@tanstack/react-table';
import { CaseFull } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { externalSystemStyles } from '../config/caseStyles';

export const formatCaseRowForExcel = (row: Row<CaseFull>) => {
  const data = row.original;

  const externalCasesText = data.externalCases.map((c) => {
    let result = [];
    if (c?.date) result.push('от ' + format(c?.date, 'dd.MM.yyyy'));
    if (c?.num) result.push('№ ' + c?.num);
    if (c?.system)
      result.push(
        '(' +
          (externalSystemStyles[c?.system].label || 'Устное поручение') +
          ')',
      );

    return result.join(' ');
  });

  return {
    ID: data.id,
    ФИО: data.title,
    Адрес: data.extra,
    Описание: data.notes,
    Автор: data.author.fio,
    Обращения: externalCasesText.join('; '),
    Статус: data.status.name,
    Направления: data.directions.map((d) => d.name).join('; '),
    Тип: data.type.name,

    Поручения: data.dispatches
      .map(
        (d) =>
          d.controlTo?.fio +
          (d.dueDate ? ' (' + format(d?.dueDate, 'dd.MM.yyyy') + ')' : ''),
      )
      .join('; '),
    'Последнее действие': [data.lastStage?.title, data.lastStage?.notes].join(
      ' ',
    ),
    'Системные проблемы':
      data?.connectionsTo?.length > 0
        ? data.connectionsTo.map((c) => c.title).join('; ')
        : 'Нет',
    'Дата создания': new Date(data.createdAt),
    'Дата последних изменений': data?.lastEdit ? new Date(data.lastEdit) : null,
  };
};
