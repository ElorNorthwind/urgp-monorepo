import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { cn, EquityRoutes, Input, VksRoutes } from '@urgp/client/shared';
import {
  EquityObjectsPageSearch,
  VksCasesPageSearch,
} from '@urgp/shared/entities';
import { Search } from 'lucide-react';

type QueryFilterProps = {
  className?: string;
};

const VksCasesQueryFilter = (props: QueryFilterProps): JSX.Element => {
  const { className } = props;
  const pathname = useLocation().pathname as VksRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;

  return (
    <Input
      type="search"
      placeholder="Поиск..."
      leading={<Search className="size-4" />}
      className={cn('w-full', className)}
      value={search?.query || ''}
      onChange={(event) =>
        navigate({
          search: (prev: VksCasesPageSearch) => ({
            ...prev,
            query:
              event.target.value && event.target.value.length > 0
                ? event.target.value
                : undefined,
          }),
        })
      }
    />
  );
};

export { VksCasesQueryFilter };
