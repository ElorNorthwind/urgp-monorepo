import { EquityTotals } from '@urgp/shared/entities';

export const countByTypeAndStatuses = (
  totals: EquityTotals[],
  status?: number[],
  type?: number,
) => {
  return totals
    .filter(
      (t) =>
        (status && status?.length > 0
          ? status?.includes(t.status?.id || 0)
          : true) && (type ? t.objectType?.id === type : true),
    )
    .reduce((prev, cur) => {
      return prev + cur.total;
    }, 0);
};
