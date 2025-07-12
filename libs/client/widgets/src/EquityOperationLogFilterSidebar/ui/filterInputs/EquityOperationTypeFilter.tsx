import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  equityObjectStatusStyles,
  equityOperationTypeStyles,
  useEquityImpornantOperationTypes,
  useEquityObjectStatus,
  useEquityOperationTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import {
  EquityObjectsPageSearch,
  EquityOperationLogPageSearch,
} from '@urgp/shared/entities';

type EquityOperationTypeFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const EquityOperationTypeFilter = (
  props: EquityOperationTypeFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'optype',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(
    pathname,
  ).useSearch() as EquityOperationLogPageSearch;
  const { data, isLoading, isFetching } = useEquityImpornantOperationTypes();

  return (
    <ClassificatorFilter
      accordionItemValue={accordionItemValue}
      label="Типы операций"
      className={cn('w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      valueStyles={equityOperationTypeStyles}
      selectedValues={search.opType}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            opType: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { EquityOperationTypeFilter };
