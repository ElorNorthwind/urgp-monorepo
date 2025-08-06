import { Row } from '@tanstack/react-table';
import { VksCase } from '@urgp/shared/entities';

export const formatVksCaseRowForExcel = (row: Row<VksCase>) => {
  const data = row.original;

  return {
    ID: data?.id,
    Дата: data?.date,
    Время: data?.time,
    'Код бронирования': data?.bookingCode,
    Услуга: data?.serviceName,
    Заявитель: data?.clientFio,
    Управление: data?.departmentName,
    Оператор: data?.operatorFio,
    'Технические трудности': data?.hasTechnicalProblems ? 'да' : 'нет',
    Оценка: data?.grade,
    'Комментарий к оценке': data?.gradeComment,
  };
};
