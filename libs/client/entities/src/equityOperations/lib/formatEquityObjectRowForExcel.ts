import { Row } from '@tanstack/react-table';
import { EquityObject, EquityOperationLogItem } from '@urgp/shared/entities';

export const formatEquityOperationLogRowForExcel = (
  row: Row<EquityOperationLogItem>,
) => {
  const data = row.original;

  return {
    ID: data?.id,
    'ID Операции': data?.operationId,
    ФИО: data?.operation?.fio ?? data?.creditor,
    'Тип операции': data?.operation?.type?.name,
    'Дата операции': data?.operation?.date
      ? new Date(data?.operation?.date)
      : '',
    'Номер операции': data?.operation?.number,
    Результат: data?.operation?.type?.fields?.includes('result')
      ? data?.operation?.result
      : '',
    'Примечания к операции': data?.operation?.notes,
    ЖК: data?.complexName,
    'Дата договора о передаче ЖК': data?.transferDate
      ? new Date(data?.transferDate)
      : '',
    Адрес: data?.addressShort || '',
    Квартира: data?.num,
    'Кадастровый номер': data?.cadNum,
    'Дата включения в РТУС': data?.claimRegistryDate
      ? new Date(data?.claimRegistryDate)
      : '',
    Статус: data?.statusName,
    Тип: data?.objectTypeName,
    Права: data?.egrnStatus,
    Этаж: data?.floor,
    Площадь: data?.s,
  };
};
