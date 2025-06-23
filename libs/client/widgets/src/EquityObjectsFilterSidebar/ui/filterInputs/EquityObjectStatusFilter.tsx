import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  directionCategoryStyles,
  equityBuildingStyles,
  useEquityBuildings,
  useEquityObjectStatus,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import { EquityObjectsPageSearch } from '@urgp/shared/entities';

type EquityObjectStatusFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const EquityObjectStatusFilter = (
  props: EquityObjectStatusFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'status',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as EquityObjectsPageSearch;
  const { data, isLoading, isFetching } = useEquityObjectStatus();

  return (
    <ClassificatorFilter
      accordionItemValue={accordionItemValue}
      label="Статусы"
      className={cn('w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      categoryStyles={equityBuildingStyles}
      selectedValues={search.status}
      iconClassName="size-3"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            status: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { EquityObjectStatusFilter };
