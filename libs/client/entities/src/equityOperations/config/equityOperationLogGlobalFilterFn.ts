import { Row } from '@tanstack/react-table';
import {
  EquityOperationLogItem,
  EquityOperationLogPageSearch,
} from '@urgp/shared/entities';
import { toDate } from 'date-fns';

export function equityOperationLogGlobalFilterFn(
  row: Row<EquityOperationLogItem>,
  columnId: string,
  filterValue: EquityOperationLogPageSearch,
): boolean {
  const { query, building, type, opType, dateFrom, dateTo } = filterValue;
  const opDate =
    row.original?.operation?.date ?? row.original?.operation?.createdAt;

  if (
    query &&
    !(
      (row.original?.creditor || '') +
      (row.original?.egrnStatus || '') +
      (row.original?.operation?.fio || '') +
      (row.original?.operation?.number || '') +
      (row.original?.cadNum || '')
    )
      ?.toLowerCase()
      .replace('ё', 'е')
      .includes(query.toLowerCase().replace('ё', 'е'))
  ) {
    return false;
  }

  if (building && !building.includes(row.original?.buildingId || 0)) {
    return false;
  }

  if (type && !type.includes(row.original?.objectTypeId || 0)) {
    return false;
  }

  if (opType && !opType.includes(row.original?.operation?.type?.id || 0)) {
    return false;
  }

  if (
    dateFrom &&
    !(
      opDate &&
      toDate(dateFrom).setHours(0, 0, 0, 0) <=
        toDate(opDate).setHours(0, 0, 0, 0)
    )
  ) {
    return false;
  }

  if (
    dateTo &&
    !(
      opDate &&
      toDate(dateTo).setHours(0, 0, 0, 0) >= toDate(opDate).setHours(0, 0, 0, 0)
    )
  ) {
    return false;
  }

  return true;
}
