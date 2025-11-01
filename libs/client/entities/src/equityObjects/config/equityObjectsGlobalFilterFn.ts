import { Row } from '@tanstack/react-table';
import {
  EquityObject,
  EquityObjectExistanceTypes,
  EquityObjectsPageSearch,
} from '@urgp/shared/entities';

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
    exists,
  } = filterValue;

  if (
    query &&
    !(
      (row.original?.creditor || '') +
      (row.original?.egrnStatus || '') +
      (row.original?.num || '') +
      (row.original?.operationsNums || '') +
      (row.original?.cadNum || '') +
      (row.original?.operationsFio || '')
    )
      ?.toLowerCase()
      .replace('ё', 'е')
      .includes(query.toLowerCase().replace('ё', 'е'))
  ) {
    return false;
  }

  if (
    apartment &&
    !apartment
      .toLowerCase()
      ?.split('|')
      ?.some((ap) =>
        [
          row.original?.num?.toLowerCase(),
          row.original?.numProject?.toLowerCase(),
          row.original?.npp?.toString()?.toLowerCase(),
        ]?.includes(ap),
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

  if (
    documents &&
    !documents.includes(row.original?.documentsResult || 'none')
  ) {
    return false;
  }

  if (
    opinionUrgp &&
    !opinionUrgp.includes(row.original?.opinionUrgp || 'нет')
  ) {
    return false;
  }

  if (
    exists &&
    !(
      (exists.includes(EquityObjectExistanceTypes.real) &&
        row.original?.isIdentified === true) ||
      (exists.includes(EquityObjectExistanceTypes.nonexist) &&
        row.original?.isIdentified !== true)
    )
  ) {
    return false;
  }

  return true;
}
