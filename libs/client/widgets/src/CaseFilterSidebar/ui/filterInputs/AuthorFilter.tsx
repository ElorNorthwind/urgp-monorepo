import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { cn, Input } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { User } from 'lucide-react';

type AuthorFilterProps = {
  className?: string;
  route?: '/control/cases' | '/control/settings/filter';
};

const AuthorFilter = (props: AuthorFilterProps): JSX.Element => {
  const { className, route = '/control/cases' } = props;
  const navigate = useNavigate({ from: route });
  const search = getRouteApi(route).useSearch() as CasesPageSearchDto;

  return (
    <Input
      type="search"
      placeholder="Автор..."
      leading={<User className="size-4" />}
      className={cn('w-full', className)}
      value={search?.author || ''}
      onChange={(event) =>
        navigate({
          search: (prev: CasesPageSearchDto) => ({
            ...prev,
            author:
              event.target.value && event.target.value.length > 0
                ? event.target.value
                : undefined,
          }),
        })
      }
    />
  );
};

export { AuthorFilter };
