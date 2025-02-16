import {
  CaseActions,
  CaseFull,
  CasesPageSearchDto,
} from '@urgp/shared/entities';
import { Row } from '@tanstack/react-table';
import { toDate } from 'date-fns';
import { store } from '@urgp/client/shared';

export function caseGlobalFilterFn(
  row: Row<CaseFull>,
  columnId: string,
  filterValue: CasesPageSearchDto,
): boolean {
  const {
    query,
    num,
    author,
    status,
    direction,
    type,
    department,
    viewStatus,
    dueFrom,
    dueTo,
    relevant,
    selectedCase,
    action,
  } = filterValue;
  const userId = store.getState().auth.user?.id;
  // const userSettings = await store.dispatch(
  //   classificatorsApi.endpoints.getCurrentUserSettings.initiate(),
  // );

  let allowed = true;

  if (selectedCase && selectedCase === row.original.id) {
    return true;
  }

  if (
    query &&
    !(
      row.original?.notes?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.title?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.extra?.toLowerCase().includes(query.toLowerCase()) ||
      row.original?.externalCases
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
    !row.original.externalCases
      .reduce((prev, cur) => {
        return prev + ' ' + cur.num;
      }, '')
      .toLowerCase()
      .includes(num.toLowerCase())
  ) {
    allowed = false;
  }
  if (
    author &&
    !row.original.author.fio?.toLocaleLowerCase().includes(author.toLowerCase())
  ) {
    allowed = false;
  }
  if (status && !status.includes(row.original?.status?.id)) {
    allowed = false;
  }
  if (viewStatus && !viewStatus.includes(row.original?.viewStatus)) {
    allowed = false;
  }
  if (type && !type.includes(row.original?.type?.id)) {
    allowed = false;
  }
  if (
    direction &&
    row.original?.directions.filter((d) => direction.includes(d.id)).length ===
      0
  ) {
    allowed = false;
  }
  if (
    department &&
    row.original?.directions.filter((d) =>
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

  if (
    relevant &&
    row?.original?.author?.id !== userId && // Автор
    row?.original?.approveFrom?.id !== userId && // Направлено от (согласование)
    row?.original?.approveTo?.id !== userId && // Направлено к (согласование)
    row?.original?.viewStatus === 'unwatched' && // Следит за делом
    !row?.original?.dispatches?.some((d) => d?.controlTo?.id === userId) // Исполнитель по любому из поручений (в т.ч. закрытым)
  ) {
    allowed = false;
  }

  const rowActions = row?.original?.actions || [];
  if (
    action &&
    !(
      rowActions?.some((a) => action.includes(a)) ||
      (rowActions.length === 0 && action.includes(CaseActions.unknown))
    )
  ) {
    allowed = false;
  }

  return allowed;
}
