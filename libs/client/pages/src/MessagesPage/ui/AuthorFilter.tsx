import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { CaseRoutes, cn, Input } from '@urgp/client/shared';
import { CasesPageSearchDto, MessagesPageSearch } from '@urgp/shared/entities';
import { Search, User2 } from 'lucide-react';

type AuthorFilterProps = {
  className?: string;
};

const AuthorFilter = (props: AuthorFilterProps): JSX.Element => {
  const { className } = props;
  const pathname = '/renovation/messages';
  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as MessagesPageSearch;

  return (
    <Input
      type="search"
      placeholder="Пользователь..."
      leading={<User2 className="size-4" />}
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
