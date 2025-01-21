import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { cn, Input } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { FileSearch2, Search } from 'lucide-react';

type NumberFilterProps = {
  className?: string;
  route?: '/control/cases' | '/control/settings/filter';
};

const NumberFilter = (props: NumberFilterProps): JSX.Element => {
  const { className, route = '/control/cases' } = props;
  const navigate = useNavigate({ from: route });
  const search = getRouteApi(route).useSearch() as CasesPageSearchDto;

  return (
    <Input
      type="search"
      placeholder="Номера..."
      leading={<FileSearch2 className="size-4" />}
      className={cn('w-full', className)}
      value={search?.num || ''}
      onChange={(event) =>
        navigate({
          search: (prev: CasesPageSearchDto) => ({
            ...prev,
            num:
              event.target.value && event.target.value.length > 0
                ? event.target.value
                : undefined,
          }),
        })
      }
    />
  );
};

export { NumberFilter };
