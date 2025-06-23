import { Row } from '@tanstack/react-table';
import { EquityObject } from '@urgp/shared/entities';

export const formatEquityObjectRowForExcel = (row: Row<EquityObject>) => {
  const data = row.original;

  return {
    ID: data.id,
    ФИО: data.creditor,
    Адрес: data.building?.addressShort || '',
    Квартира: data.num,
    Статус: data.status?.name,
  };
};
