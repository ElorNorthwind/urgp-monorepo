import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  equityObjectStatusStyles,
  equityOperationTypeStyles,
  useEquityImpornantOperationTypes,
  useEquityObjectStatus,
  useEquityOperationTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter, DateRangeSelect } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import {
  EquityObjectsPageSearch,
  EquityOperationLogPageSearch,
} from '@urgp/shared/entities';
import { format, toDate } from 'date-fns';

type EquityOperationDateFilterProps = {
  className?: string;
};

const EquityOperationDateFilter = (
  props: EquityOperationDateFilterProps,
): JSX.Element => {
  const { className } = props;
  const pathname = useLocation().pathname as EquityRoutes;
  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(
    pathname,
  ).useSearch() as EquityOperationLogPageSearch;

  return (
    <DateRangeSelect
      label="Дата"
      className={className}
      from={search.dateFrom ? toDate(search.dateFrom) : undefined}
      to={search.dateTo ? toDate(search.dateTo) : undefined}
      onSelect={(range) =>
        navigate({
          search: {
            ...search,
            dateFrom: range?.from
              ? format(range.from, 'yyyy-MM-dd')
              : undefined,
            dateTo: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
          },
        })
      }
    />
  );
};

export { EquityOperationDateFilter };
