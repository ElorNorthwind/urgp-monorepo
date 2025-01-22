import {
  getRouteApi,
  useLocation,
  useNavigate,
  useRouter,
} from '@tanstack/react-router';
import { CaseRoutes, cn, Input } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { User } from 'lucide-react';

type AuthorFilterProps = {
  className?: string;
};

const AuthorFilter = (props: AuthorFilterProps): JSX.Element => {
  const { className } = props;
  const pathname = useLocation().pathname as CaseRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;
  const router = useRouter();
  router.routesByPath;

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
