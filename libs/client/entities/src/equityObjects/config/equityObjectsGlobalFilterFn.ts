import { Row } from '@tanstack/react-table';
import { EquityObject, EquityObjectsPageSearch } from '@urgp/shared/entities';

export function equityObjectsGlobalFilterFn(
  row: Row<EquityObject>,
  columnId: string,
  filterValue: EquityObjectsPageSearch,
): boolean {
  const { query, status, building, type, problem } = filterValue;
  if (
    query &&
    !(
      row.original?.creditor?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.egrnStatus?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.num?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.cadNum?.toLowerCase().includes(query.toLowerCase())
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
    problem &&
    row.original?.problems.filter((p) => problem.includes(p)).length === 0 &&
    !(problem.includes('none') && row.original?.problems.length === 0)
  ) {
    return false;
  }

  return true;
}
