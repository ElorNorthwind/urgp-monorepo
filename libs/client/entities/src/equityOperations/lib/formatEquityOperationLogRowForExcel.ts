import { Row } from '@tanstack/react-table';
import { EquityObject, EquityOperationLogItem } from '@urgp/shared/entities';
import { equityProblemsStyles } from '../../equityClassificators';

export const formatEquityOperationLogRowForExcel = (
  row: Row<EquityOperationLogItem>,
) => {
  const data = row.original;

  return {
    ID: data?.id,
    'ID Операции': data?.operationId,
    'Примечания к операции': data?.operation?.notes,

    ЖК: data?.complexName,
    Адрес: data?.addressShort || '',
    Квартира: data?.num,
    'Проектный номер': data?.numProject?.split('; ')?.[0] || '',
    'Проектнная площадь': data?.sProject || null,

    'Кадастровый номер': data?.cadNum,

    Заявитель: data?.operation?.fio ?? data?.creditor,
    'Кредитор по РТУС': data?.creditor,

    Этаж: data?.floor,
    Площадь: data?.s,

    'Заключение УРЖП': data?.opinionUrgp,
    'Примечание УРЖП': data?.urgpNotes,

    Проблемы: data?.problems
      ?.map((p) => equityProblemsStyles?.[p]?.label || '-')
      .join('; '),

    'Тип операции': data?.operation?.type?.name,
    'Дата операции': data?.operation?.date
      ? new Date(data?.operation?.date)
      : '',
    'Номер операции': data?.operation?.number,
    Результат: data?.operation?.type?.fields?.includes('result')
      ? data?.operation?.result
      : '',

    'Дата включения в РТУС': data?.claimRegistryDate
      ? new Date(data?.claimRegistryDate)
      : '',
    Статус: data?.statusName,
    Тип: data?.objectTypeName,
    Права: data?.egrnStatus,
  };
};
