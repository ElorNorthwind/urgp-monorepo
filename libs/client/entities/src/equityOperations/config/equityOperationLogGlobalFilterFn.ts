import { Row } from '@tanstack/react-table';
import {
  EquityOperationLogItem,
  EquityOperationLogPageSearch,
} from '@urgp/shared/entities';

export function equityOperationLogGlobalFilterFn(
  row: Row<EquityOperationLogItem>,
  columnId: string,
  filterValue: EquityOperationLogPageSearch,
): boolean {
  const { query, building, type, opType } = filterValue;
  if (
    query &&
    !(
      row.original?.creditor?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.egrnStatus?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.operation?.fio
        ?.toLowerCase()
        .includes(query.toLowerCase()) ||
      row.original?.operation?.number
        ?.toLowerCase()
        .includes(query.toLowerCase()) ||
      row.original?.cadNum?.toLowerCase().includes(query.toLowerCase())
    )
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

  return true;
}
