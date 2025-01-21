import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { cn, Input } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { Search } from 'lucide-react';

type QueryFilterProps = {
  className?: string;
  route?: '/control/cases' | '/control/settings/filter';
};

const QueryFilter = (props: QueryFilterProps): JSX.Element => {
  const { className, route = '/control/cases' } = props;
  const navigate = useNavigate({ from: route });
  const search = getRouteApi(route).useSearch() as CasesPageSearchDto;

  return (
    <Input
      type="search"
      placeholder="Поиск..."
      leading={<Search className="size-4" />}
      className={cn('w-full', className)}
      value={search?.query || ''}
      onChange={(event) =>
        navigate({
          search: (prev: CasesPageSearchDto) => ({
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

export { QueryFilter };
