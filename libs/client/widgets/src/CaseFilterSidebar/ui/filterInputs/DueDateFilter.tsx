import { getRouteApi, useNavigate } from '@tanstack/react-router';
import { DateRangeSelect } from '@urgp/client/features';
import { cn, Input } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { format } from 'date-fns';

type DueDateFilterProps = {
  className?: string;
  route?: '/control/cases' | '/control/settings/filter';
};

const DueDateFilter = (props: DueDateFilterProps): JSX.Element => {
  const { className, route = '/control/cases' } = props;
  const navigate = useNavigate({ from: route });
  const search = getRouteApi(route).useSearch() as CasesPageSearchDto;

  return (
    <DateRangeSelect
      label="Срок"
      className={cn('w-full', className)}
      from={search.dueFrom ? new Date(search.dueFrom) : undefined}
      to={search.dueTo ? new Date(search.dueTo) : undefined}
      onSelect={(range) =>
        navigate({
          search: (prev: CasesPageSearchDto) => ({
            ...prev,
            dueFrom: range?.from ? format(range.from, 'yyyy-MM-dd') : undefined,
            dueTo: range?.to ? format(range.to, 'yyyy-MM-dd') : undefined,
          }),
        })
      }
    />
  );
};

export { DueDateFilter };
