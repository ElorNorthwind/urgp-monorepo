import { CasesPageSearchDto, Case } from '@urgp/shared/entities';
import { Row } from '@tanstack/react-table';
import { toDate } from 'date-fns';
import { store } from '@urgp/client/shared';
import { classificatorsApi } from '../../classificators';

export function caseGlobalFilterFn(
  row: Row<Case>,
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

  if (
    relevant &&
    row?.original?.author?.id !== userId && // Автор
    row?.original?.payload?.approveBy?.id !== userId && // Согласовал
    row?.original?.payload?.approver?.id !== userId && // Рассматривает
    row?.original?.viewStatus === 'unwatched' && // Следит за делом
    !row?.original?.dispatches?.some((d) => d?.executor?.id === userId) // Исполнитель по любому из поручений (в т.ч. закрытым)
    // && !userSettings.data?.directions.some((d) =>
    //   row?.original?.payload?.directions.some((cd) => cd.id === d),
    // ) // Нет тем из списка отслеживаемых
  ) {
    allowed = false;
  }

  return allowed;
}
