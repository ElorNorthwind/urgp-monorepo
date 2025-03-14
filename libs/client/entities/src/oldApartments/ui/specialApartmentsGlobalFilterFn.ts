import { Row } from '@tanstack/react-table';
import { OldAppartment, SpecialApartmentSearch } from '@urgp/shared/entities';

export function specialApartmentsGlobalFilterFn(
  row: Row<OldAppartment>,
  columnId: string,
  filterValue: SpecialApartmentSearch,
): boolean {
  const { okrugs, districts, deviation, fio } = filterValue;
  let allowed = true;
  if (okrugs && !okrugs.includes(row.original.okrug)) allowed = false;
  if (districts && !districts.includes(row.original.district)) allowed = false;

  if (deviation && !deviation.includes(row.original.classificator.deviation))
    allowed = false;

  if (fio) {
    allowed = row.original.fio?.toLowerCase().includes(fio.toLowerCase());
  }

  return allowed;
}
