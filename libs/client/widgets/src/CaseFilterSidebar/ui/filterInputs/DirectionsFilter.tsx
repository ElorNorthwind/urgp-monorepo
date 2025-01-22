import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  directionCategoryStyles,
  useCaseDirectionTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { CaseRoutes, cn } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';

type DirectionsFilterProps = {
  variant?: 'popover' | 'checkbox' | 'accordion';
  className?: string;
  accordionItemValue?: string;
};

const DirectionsFilter = (props: DirectionsFilterProps): JSX.Element => {
  const {
    className,
    variant = 'accordion',
    accordionItemValue = 'directions',
  } = props;
  const pathname = useLocation().pathname as CaseRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;
  const { data, isLoading, isFetching } = useCaseDirectionTypes();

  return (
    <ClassificatorFilter
      accordionItemValue={accordionItemValue}
      label="Направления"
      className={cn('w-full', className)}
      variant={variant}
      isLoading={isLoading || isFetching}
      options={data || []}
      categoryStyles={directionCategoryStyles}
      selectedValues={search.direction}
      iconClassName="size-3"
      shortBadge
      setSelectedValues={(values) =>
        navigate({
          search: {
            ...search,
            direction: values.length > 0 ? values : undefined,
          },
        })
      }
    />
  );
};

export { DirectionsFilter };
