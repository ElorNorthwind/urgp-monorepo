import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { DateRangeSelect } from '@urgp/client/features';
import { CaseRoutes, cn, Input } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { format } from 'date-fns';

type DueDateFilterProps = {
  className?: string;
};

const DueDateFilter = (props: DueDateFilterProps): JSX.Element => {
  const { className } = props;
  const pathname = useLocation().pathname as CaseRoutes;
  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;

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
