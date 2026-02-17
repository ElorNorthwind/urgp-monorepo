import { Row } from '@tanstack/react-table';
import { VksCase, VksCasesPageSearch } from '@urgp/shared/entities';

export function vksCasesGlobalFilterFn(
  row: Row<VksCase>,
  columnId: string,
  filterValue: VksCasesPageSearch,
): boolean {
  const {
    query,
    status,
    service,
    department,
    grade,
    operator,
    type,
    operatorSurvey,
  } = filterValue;

  const clientId = query && query?.match(/^Клиент:\[(\d+)\]/)?.[1];

  if (
    query &&
    !clientId &&
    !(
      (row.original?.clientFio || '') +
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

  if (clientId && !((row.original?.clientId || '0') === clientId)) {
    return false;
  }

  if (
    operator &&
    !(row.original?.operatorFio || '')

      ?.toLowerCase()
      .replace('ё', 'е')
      .includes(operator.toLowerCase().replace('ё', 'е'))
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

  if (
    operatorSurvey &&
    !(
      (operatorSurvey.includes(1) && row.original?.operatorSurveyDate) ||
      (operatorSurvey.includes(0) && !row.original?.operatorSurveyDate)
    )
  ) {
    return false;
  }

  if (
    type &&
    !type.includes(row.original?.operatorSurveyConsultationType || '')
  ) {
    return false;
  }

  if (
    grade &&
    !(
      (grade.includes(0) && !row.original?.grade) ||
      (grade.includes(-1) && row.original?.isTechnical) ||
      grade.includes(row.original?.grade || 0)
    )
  ) {
    return false;
  }

  return true;
}
