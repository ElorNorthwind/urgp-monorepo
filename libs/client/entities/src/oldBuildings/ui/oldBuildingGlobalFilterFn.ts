import { GetOldBuldingsDto, OldBuilding } from '@urgp/shared/entities';
import { Row } from '@tanstack/react-table';
import { toDate } from 'date-fns';

export function oldBuildingsGlobalFilterFn(
  row: Row<OldBuilding>,
  columnId: string,
  filterValue: GetOldBuldingsDto,
): boolean {
  const {
    adress,
    okrugs,
    districts,
    relocationType,
    deviation,
    relocationAge,
    relocationStatus,
    startFrom,
    startTo,
  } = filterValue;
  let allowed = true;
  if (okrugs && !okrugs.includes(row.original.okrug)) allowed = false;
  if (districts && !districts.includes(row.original.district)) allowed = false;
  if (relocationType && !relocationType.includes(row.original.relocationTypeId))
    allowed = false;
  if (deviation && !deviation.includes(row.original.buildingDeviation))
    allowed = false;
  if (
    relocationAge &&
    !relocationAge.includes(row.original.buildingRelocationStartAge)
  )
    allowed = false;
  if (
    relocationStatus &&
    !relocationStatus.includes(row.original.buildingRelocationStatus)
  )
    allowed = false;
  if (
    adress &&
    !row.original.adress
      .toLocaleLowerCase()
      .includes(adress.toLocaleLowerCase())
  )
    allowed = false;

  if (
    startFrom &&
    !(
      toDate(
        row?.original?.terms?.actual?.firstResetlementStart ??
          row?.original?.terms?.plan?.firstResetlementStart ??
          0,
      ) >= toDate(startFrom)
    )
  )
    allowed = false;

  if (
    startTo &&
    !(
      toDate(
        row?.original?.terms?.actual?.firstResetlementStart ??
          row?.original?.terms?.plan?.firstResetlementStart ??
          0,
      ) <= toDate(startTo)
    )
  )
    allowed = false;

  return allowed;
}
