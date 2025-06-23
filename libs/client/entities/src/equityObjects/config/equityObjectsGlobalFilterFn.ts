import {
  CaseActions,
  CaseFull,
  CasesPageSearchDto,
  ControlToMeStatus,
  EquityObject,
  EquityObjectsPageSearch,
} from '@urgp/shared/entities';
import { Row } from '@tanstack/react-table';
import { toDate } from 'date-fns';
import { store } from '@urgp/client/shared';

export function equityObjectsGlobalFilterFn(
  row: Row<EquityObject>,
  columnId: string,
  filterValue: EquityObjectsPageSearch,
): boolean {
  const { query, status } = filterValue;
  let allowed = true;

  if (
    query &&
    !(
      row.original?.creditor?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.egrnHolderName
        ?.toLowerCase()
        .includes(query.toLowerCase()) ||
      row.original?.num?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.cadNum?.toLowerCase().includes(query.toLowerCase())
    )
  ) {
    allowed = false;
  }

  return allowed;
}
