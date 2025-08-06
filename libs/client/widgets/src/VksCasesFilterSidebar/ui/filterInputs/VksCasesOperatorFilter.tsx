import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { cn, Input, VksRoutes } from '@urgp/client/shared';
import { VksCasesPageSearch } from '@urgp/shared/entities';
import { UserRound } from 'lucide-react';

type QueryFilterProps = {
  className?: string;
};

const VksCasesOperatorFilter = (props: QueryFilterProps): JSX.Element => {
  const { className } = props;
  const pathname = useLocation().pathname as VksRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;

  return (
    <Input
      type="search"
      placeholder="Оператор..."
      leading={<UserRound className="size-4" />}
      className={cn('w-full', className)}
      value={search?.operator || ''}
      onChange={(event) =>
        navigate({
          search: (prev: VksCasesPageSearch) => ({
            ...prev,
            operator:
              event.target.value && event.target.value.length > 0
                ? event.target.value
                : undefined,
          }),
        })
      }
    />
  );
};

export { VksCasesOperatorFilter };
