import { Row } from '@tanstack/react-table';
import { EquityObject } from '@urgp/shared/entities';

export const formatEquityObjectRowForExcel = (row: Row<EquityObject>) => {
  const data = row.original;

  return {
    ID: data.id,
    ЖК: data.complexName,
    Адрес: data.addressShort || '',
    Квартира: data.num,
    'Кадастровый номер': data.cadNum,
    ФИО: data.creditor,
    Статус: data.statusName,
    Тип: data.objectTypeName,
    Права: data.egrnStatus,
    Этаж: data.floor,
  };
};
