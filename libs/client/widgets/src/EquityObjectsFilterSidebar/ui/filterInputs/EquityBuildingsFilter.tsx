import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  directionCategoryStyles,
  equityBuildingStyles,
  useEquityBuildings,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn, EquityRoutes } from '@urgp/client/shared';
import { EquityObjectsPageSearch } from '@urgp/shared/entities';

type EquityBuildingsFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const EquityBuildingsFilter = (
  props: EquityBuildingsFilterProps,
): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'buildings',
  } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as EquityObjectsPageSearch;
  const { data, isLoading, isFetching } = useEquityBuildings();

  return (
    <ClassificatorFilter
      accordionItemValue={accordionItemValue}
      label="Адреса"
      className={cn('w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      // categoryStyles={equityBuildingStyles}
      categoryPropertyStyles={equityBuildingStyles}
      selectedValues={search.building}
      iconClassName="size-5"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            building: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { EquityBuildingsFilter };
