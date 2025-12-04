import {
  GetOldBuldingsDto,
  NewBuildingsSearch,
  OldBuilding,
  RenovationNewBuilding,
} from '@urgp/shared/entities';
import { Row } from '@tanstack/react-table';
import { toDate } from 'date-fns';

export function newBuildingsGlobalFilterFn(
  row: Row<RenovationNewBuilding>,
  columnId: string,
  filterValue: NewBuildingsSearch,
): boolean {
  const {
    adress,
    okrugs,
    districts,
    deviation,
    relocationAge,
    relocationStatus,
    startFrom,
    startTo,
  } = filterValue;
  if (okrugs && !okrugs.includes(row.original.okrug)) return false;

  if (districts && !districts.includes(row.original.district)) return false;

  if (deviation && !deviation.includes(row.original.plotDeviation))
    return false;

  if (relocationAge && !relocationAge.includes(row.original.plotStartAge))
    return false;

  if (relocationStatus && !relocationStatus.includes(row.original.plotStatus))
    return false;

  if (
    adress &&
    !row.original.adress
      .toLocaleLowerCase()
      .includes(adress.toLocaleLowerCase()) &&
    !row.original?.oldBuildings?.some((b) =>
      b?.adress?.toLocaleLowerCase().includes(adress.toLocaleLowerCase()),
    )
  )
    return false;

  if (
    startFrom &&
    !(
      toDate(
        row?.original?.actualPlotStart ?? row?.original?.planPlotStart ?? 0,
      ) >= toDate(startFrom)
    )
  )
    return false;

  if (
    startTo &&
    !(
      toDate(
        row?.original?.actualPlotStart ?? row?.original?.planPlotStart ?? 0,
      ) <= toDate(startTo)
    )
  )
    return false;

  return true;
}
