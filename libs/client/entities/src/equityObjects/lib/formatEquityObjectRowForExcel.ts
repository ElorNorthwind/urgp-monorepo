import { Row } from '@tanstack/react-table';
import { EquityObject } from '@urgp/shared/entities';

export const formatEquityObjectRowForExcel = (row: Row<EquityObject>) => {
  const data = row.original;

  return {
    ID: data?.id,
    ЖК: data?.complexName,
    'Дата договора о передаче ЖК': data?.transferDate
      ? new Date(data?.transferDate)
      : '',
    Адрес: data?.addressShort || '',
    Квартира: data?.num,
    'Кадастровый номер': data?.cadNum,
    Кредитор: data?.creditor,
    'Дата включения в РТУС': data?.claimRegistryDate
      ? new Date(data?.claimRegistryDate)
      : '',
    Статус: data?.statusName,
    Тип: data?.objectTypeName,
    Права: data?.egrnStatus,
    Этаж: data?.floor,
    Площадь: data?.s,
    Документы: data?.documentsOk
      ? 'полный пакет'
      : data?.documentsProblem
        ? 'пакет с замечаниями'
        : 'нет документов',
    'Дата подачи документов': data?.documentsDate
      ? new Date(data?.documentsDate)
      : '',

    'ФИО по представленным документам':
      data?.documentsFio || data?.creditor || '',
    'Заключение УРЖП': data?.opinionUrgp,
  };
};
