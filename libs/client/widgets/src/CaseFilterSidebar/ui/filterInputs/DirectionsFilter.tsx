import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  directionCategoryStyles,
  useCaseDirectionTypes,
} from '@urgp/client/entities';
import { ClassificatorFilter } from '@urgp/client/features';
import { cn } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';

type DirectionsFilterProps = {
  variant?: 'popover' | 'checkbox';
  className?: string;
};

const DirectionsFilter = (props: DirectionsFilterProps): JSX.Element => {
  const { className, variant = 'checkbox' } = props;

  const navigate = useNavigate({ from: '/control' });
  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;
  const { data, isLoading, isFetching } = useCaseDirectionTypes();

  return (
    <ClassificatorFilter
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
