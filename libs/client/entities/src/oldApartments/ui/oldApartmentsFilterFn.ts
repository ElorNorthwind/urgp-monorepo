import { Row } from '@tanstack/react-table';
import { OldApartmentSearch, OldAppartment } from '@urgp/shared/entities';

export function oldApartmentsFilterFn(
  row: Row<OldAppartment>,
  columnId: string,
  filterValue: OldApartmentSearch,
): boolean {
  const {
    okrugs,
    districts,
    relocationType,
    deviation,
    relocationAge,
    relocationStatus,
    buildingIds,
    buildingDeviation,
    stage,
    fio,
  } = filterValue;

  if (okrugs && !okrugs.includes(row.original?.okrug || '')) {
    return false;
  }

  if (districts && !districts.includes(row.original?.district || '')) {
    return false;
  }

  if (
    relocationType &&
    !relocationType.includes(row.original?.relocationTypeId || 0)
  ) {
    return false;
  }

  if (
    deviation &&
    !deviation.includes(row.original?.classificator?.deviation || '')
  ) {
    return false;
  }

  if (
    buildingDeviation &&
    !buildingDeviation.includes(row.original?.buildingDeviation || '')
  ) {
    return false;
  }

  if (buildingIds && !buildingIds.includes(row.original?.buildingId || 0)) {
    return false;
  }

  if (
    relocationStatus &&
    !relocationStatus.includes(row.original?.buildingRelocationStatus || '')
  ) {
    return false;
  }

  if (stage && !stage.includes(row.original?.classificator?.stageId || 0)) {
    return false;
  }

  if (
    relocationAge &&
    !relocationAge.includes(row.original?.relocationAge || '')
  ) {
    return false;
  }

  if (
    fio &&
    !(row.original?.fio || '')
      ?.toLowerCase()
      .replace('ё', 'е')
      .includes(fio.toLowerCase().replace('ё', 'е'))
  ) {
    return false;
  }

  return true;
}
