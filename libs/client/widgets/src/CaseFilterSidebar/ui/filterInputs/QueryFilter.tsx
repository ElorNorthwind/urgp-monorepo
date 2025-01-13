import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { cn, Input } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { Search } from 'lucide-react';

type QueryFilterProps = {
  className?: string;
};

const QueryFilter = (props: QueryFilterProps): JSX.Element => {
  const { className } = props;
  const navigate = useNavigate({ from: '/control' });
  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;

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
