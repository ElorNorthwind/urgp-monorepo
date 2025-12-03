import { Row } from '@tanstack/react-table';
import { VksCase } from '@urgp/shared/entities';
import { format, toDate } from 'date-fns';
import { gradeSourceStyles } from '../config/vksStyles';

export const formatVksCaseRowForExcel = (row: Row<VksCase>) => {
  const data = row.original;

  const { label: gradeSourceLabel } =
    gradeSourceStyles?.[
      (data?.gradeSource || 'none') as keyof typeof gradeSourceStyles
    ] || Object.values(gradeSourceStyles)[0];

  return {
    ID: data?.id,
    Дата: new Date(toDate(data?.date).setHours(0, 0, 0, 0)), //data?.date,
    Время: data?.time,
    'Код бронирования': data?.bookingCode,
    Услуга: data?.serviceFullName,
    Заявитель: data?.clientFio,
    Управление: data?.departmentName,
    Оператор: data?.operatorFio,
    'Тип консультации': data?.operatorSurveyConsultationType,
    'Технические трудности': data?.hasTechnicalProblems ? 'да' : 'нет',
    Оценка: data?.isTechnical ? 'по технике' : data?.grade,
    'Комментарий к оценке': data?.gradeComment,
    'Источник оценки': gradeSourceLabel,
    'Ссылка оператора': data?.operatorLink,
  };
};
