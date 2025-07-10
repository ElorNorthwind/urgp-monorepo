import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { cn, EquityRoutes, Input } from '@urgp/client/shared';
import { EquityObjectsPageSearch } from '@urgp/shared/entities';
import { Search } from 'lucide-react';

type ApartmentNumberFilterProps = {
  className?: string;
};

const EquityApartmentNumberFilter = (
  props: ApartmentNumberFilterProps,
): JSX.Element => {
  const { className } = props;
  const pathname = useLocation().pathname as EquityRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as EquityObjectsPageSearch;

  return (
    <Input
      type="search"
      placeholder="Кв №"
      // leading={<Search className="size-4" />}
      className={cn('w-full', className)}
      value={search?.apartment || ''}
      onChange={(event) =>
        navigate({
          search: (prev: EquityObjectsPageSearch) => ({
            ...prev,
            apartment:
              event.target.value && event.target.value.length > 0
                ? event.target.value
                : undefined,
          }),
        })
      }
    />
  );
};

export { EquityApartmentNumberFilter };
