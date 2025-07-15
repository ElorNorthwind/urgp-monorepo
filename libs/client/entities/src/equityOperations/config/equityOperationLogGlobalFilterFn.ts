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
  const {
    query,
    building,
    type,
    opType,
    dateFrom,
    dateTo,
    status,
    problem,
    documents,
    claimTransfer,
    opinionUrgp,
  } = filterValue;
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
    claimTransfer &&
    !claimTransfer.includes(row.original?.claimTransfer || '')
  ) {
    return false;
  }

  if (status && !status.includes(row.original?.statusId || 0)) {
    return false;
  }

  if (
    problem &&
    row.original?.problems.filter((p) => problem.includes(p)).length === 0 &&
    !(problem.includes('none') && row.original?.problems.length === 0)
  ) {
    return false;
  }

  // Screams for backend view refactor
  if (
    documents &&
    !(
      (documents.includes('ok') && row?.original?.documentsOk) ||
      (documents.includes('problem') &&
        row?.original?.documentsProblem &&
        !row?.original?.documentsOk) ||
      (documents.includes('none') &&
        !row?.original?.documentsOk &&
        !row?.original?.documentsProblem)
    )
  ) {
    return false;
  }

  // Screams for backend view refactor
  if (
    opinionUrgp &&
    !(
      (opinionUrgp.includes('положительное') &&
        row?.original?.opinionUrgp === 'положительное') ||
      (opinionUrgp.includes('условно-положительное') &&
        row?.original?.opinionUrgp === 'условно-положительное') ||
      (opinionUrgp.includes('отрицательное') &&
        row?.original?.opinionUrgp === 'отрицательное') ||
      (opinionUrgp.includes('нет') && row?.original?.opinionUrgp === 'нет')
    )
  ) {
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
