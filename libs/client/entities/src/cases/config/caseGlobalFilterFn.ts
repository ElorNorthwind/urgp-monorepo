import { CasesPageSearchDto, Case } from '@urgp/shared/entities';
import { Row } from '@tanstack/react-table';
import { toDate } from 'date-fns';

export function caseGlobalFilterFn(
  row: Row<Case>,
  columnId: string,
  filterValue: CasesPageSearchDto,
): boolean {
  const { query, num, status, direction, type, department, dueFrom, dueTo } =
    filterValue;
  let allowed = true;

  if (
    query &&
    !(
      row.original.payload.description
        ?.toLowerCase()
        .includes(query.toLowerCase()) ||
      row.original.payload.fio?.toLowerCase().includes(query.toLowerCase()) ||
      row.original.payload.adress
        ?.toLowerCase()
        .includes(query.toLowerCase()) ||
      row.original.payload.externalCases
        .reduce((prev, cur) => {
          return prev + ' ' + cur.num;
        }, '')
        .toLowerCase()
        .includes(query.toLowerCase())
    )
  ) {
    allowed = false;
  }
  if (
    num &&
    !row.original.payload.externalCases
      .reduce((prev, cur) => {
        return prev + ' ' + cur.num;
      }, '')
      .toLowerCase()
      .includes(num.toLowerCase())
  ) {
    allowed = false;
  }
  if (status && !status.includes(row.original?.status?.id)) {
    allowed = false;
  }
  if (type && !type.includes(row.original?.payload?.type?.id)) {
    allowed = false;
  }
  if (
    direction &&
    row.original?.payload?.directions.filter((d) => direction.includes(d.id))
      .length === 0
  ) {
    allowed = false;
  }
  if (
    department &&
    row.original?.payload?.directions.filter((d) =>
      department.includes(d.category || '-'),
    ).length === 0
  ) {
    allowed = false;
  }
  if (
    dueFrom &&
    !(toDate(row?.original?.dispatches?.[0]?.dueDate ?? 0) >= toDate(dueFrom))
  ) {
    allowed = false;
  }
  if (
    dueTo &&
    !(toDate(row?.original?.dispatches?.[0]?.dueDate ?? 0) <= toDate(dueTo))
  ) {
    allowed = false;
  }
  return allowed;
}
