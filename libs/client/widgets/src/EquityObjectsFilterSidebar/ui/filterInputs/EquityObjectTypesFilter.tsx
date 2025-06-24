import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  equityObjectTypeStyles,
  useEquityObjectTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import { EquityObjectsPageSearch } from '@urgp/shared/entities';

type EquityObjectTypeFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const EquityObjectTypeFilter = (
  props: EquityObjectTypeFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'type',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as EquityObjectsPageSearch;
  const { data, isLoading, isFetching } = useEquityObjectTypes();

  return (
    <ClassificatorFilter
      accordionItemValue={accordionItemValue}
      label="Типы объектов"
      className={cn('w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      valueStyles={equityObjectTypeStyles}
      selectedValues={search.type}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            type: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { EquityObjectTypeFilter };
