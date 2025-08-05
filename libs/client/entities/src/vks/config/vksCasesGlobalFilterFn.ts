import { Row } from '@tanstack/react-table';
import { VksCase, VksCasesPageSearch } from '@urgp/shared/entities';

export function vksCasesGlobalFilterFn(
  row: Row<VksCase>,
  columnId: string,
  filterValue: VksCasesPageSearch,
): boolean {
  const { query, status, service, department } = filterValue;

  if (
    query &&
    !(
      (row.original?.clientFio || '') +
      (row.original?.operatorFio || '') +
      (row.original?.bookingCode || '') +
      (row.original?.departmentName || '') +
      (row.original?.serviceName || '')
    )
      ?.toLowerCase()
      .replace('ё', 'е')
      .includes(query.toLowerCase().replace('ё', 'е'))
  ) {
    return false;
  }

  if (status && !status.includes(row.original?.status || '')) {
    return false;
  }

  if (service && !service.includes(row.original?.serviceName || '')) {
    return false;
  }

  if (department && !department.includes(row.original?.departmentId || 0)) {
    return false;
  }

  return true;
}
