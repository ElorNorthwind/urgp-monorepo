import { Row } from '@tanstack/react-table';
import { VksCaseSlim } from '@urgp/shared/entities';

export const formatVksCaseRowForExcel = (row: Row<VksCaseSlim>) => {
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
    Оценка: data?.grade,
  };
};
