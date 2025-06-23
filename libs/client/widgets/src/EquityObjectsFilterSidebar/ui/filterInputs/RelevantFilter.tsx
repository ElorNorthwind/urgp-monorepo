import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { CaseRoutes, cn, Input, Label, Switch } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { FileSearch2, Search } from 'lucide-react';

type RelevantFilterProps = {
  className?: string;
};

const RelevantFilter = (props: RelevantFilterProps): JSX.Element => {
  const { className } = props;
  const pathname = useLocation().pathname as CaseRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center space-x-2">
        <Switch
          id="relevant"
          checked={search?.relevant === true}
          onCheckedChange={(event) => {
            navigate({
              search: (prev: CasesPageSearchDto) => ({
                ...prev,
                relevant: event === true ? true : undefined,
              }),
            });
          }}
        />
        <Label htmlFor="relevant" className={'cursor-pointer pr-2'}>
          С моим участием
        </Label>
      </div>
    </div>
  );
};

export { RelevantFilter };
