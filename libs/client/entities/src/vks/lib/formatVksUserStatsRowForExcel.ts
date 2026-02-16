import { Row } from '@tanstack/react-table';
import { VksUserStats } from '@urgp/shared/entities';
import { toDate } from 'date-fns';

export const formatVksUserStatRowForExcel = (row: Row<VksUserStats>) => {
  const data = row.original;
  return {
    'ФИО оператора': data?.operator,
    'Проведено консультаций': data?.total,
    'Оценка 1': data?.g1,
    'Оценка 2': data?.g2,
    'Оценка 3': data?.g3,
    'Оценка 4': data?.g4,
    'Оценка 5': data?.g5,
    Конверсия: data?.graded,
    'Средний бал': data?.grade,
    'Рабочих дней': data?.wd,
    Загрузка: data?.load,
  };
};
