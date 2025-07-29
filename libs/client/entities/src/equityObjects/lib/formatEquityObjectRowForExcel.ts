import { Row } from '@tanstack/react-table';
import { EquityObject } from '@urgp/shared/entities';

export const formatEquityObjectRowForExcel = (row: Row<EquityObject>) => {
  const data = row.original;

  return {
    ID: data?.id,
    ЖК: data?.complexName,
    Адрес: data?.addressShort || '',
    Квартира: data?.num,
    'Проектный номер': data?.numProject?.split('; ')?.[0] || '',
    Этаж: data?.floor,
    Площадь: data?.s,
    'Кадастровый номер': data?.cadNum,
    Кредитор: data?.creditor,
    'Дата договора о передаче ЖК': data?.transferDate
      ? new Date(data?.transferDate)
      : '',
    'Дата включения в РТУС': data?.claimRegistryDate
      ? new Date(data?.claimRegistryDate)
      : '',
    Статус: data?.statusName,
    Тип: data?.objectTypeName,
    Права: data?.egrnStatus,

    Документы:
      data?.documentsResult === 'ok'
        ? 'полный пакет'
        : data?.documentsResult === 'problem'
          ? 'пакет с замечаниями'
          : 'нет документов',
    'Дата подачи документов': data?.documentsDate
      ? new Date(data?.documentsDate)
      : '',

    'ФИО по представленным документам':
      data?.documentsFio || data?.creditor || '',
    'Заключение УРЖП': data?.opinionUrgp,
    'Примечание УРЖП': data?.urgpNotes,
  };
};
