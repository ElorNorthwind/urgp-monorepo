import { Row } from '@tanstack/react-table';
import { EquityObject, EquityObjectsPageSearch } from '@urgp/shared/entities';

export function equityObjectsGlobalFilterFn(
  row: Row<EquityObject>,
  columnId: string,
  filterValue: EquityObjectsPageSearch,
): boolean {
  const {
    query,
    apartment,
    status,
    building,
    type,
    problem,
    documents,
    claimTransfer,
    opinionUrgp,
  } = filterValue;
  if (
    query &&
    !(
      row.original?.creditor?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.egrnStatus?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.num?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.operationsNums
        ?.toLowerCase()
        .includes(query.toLowerCase()) ||
      row.original?.cadNum?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.operationsFio?.toLowerCase().includes(query.toLowerCase())
    )
  ) {
    return false;
  }
  if (
    apartment &&
    !(
      row.original?.num?.toLowerCase() === apartment.toLowerCase() ||
      row.original?.numProject?.toLowerCase() === apartment.toLowerCase() ||
      row.original?.npp?.toString()?.toLowerCase() === apartment.toLowerCase()
    )
  ) {
    return false;
  }

  if (status && !status.includes(row.original?.statusId || 0)) {
    return false;
  }

  if (building && !building.includes(row.original?.buildingId || 0)) {
    return false;
  }

  if (type && !type.includes(row.original?.objectTypeId || 0)) {
    return false;
  }

  if (
    claimTransfer &&
    !claimTransfer.includes(row.original?.claimTransfer || '')
  ) {
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

  return true;
}
