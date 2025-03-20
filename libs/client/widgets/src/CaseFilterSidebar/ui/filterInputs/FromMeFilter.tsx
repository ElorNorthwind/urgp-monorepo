import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { CaseRoutes, cn, Input, Label, Switch } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { FileSearch2, Search } from 'lucide-react';

type FromMeFilterProps = {
  className?: string;
};

const FromMeFilter = (props: FromMeFilterProps): JSX.Element => {
  const { className } = props;
  const pathname = useLocation().pathname as CaseRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;

  return (
    <div className={cn('flex flex-col gap-2', className)}>
      <div className="flex items-center space-x-2">
        <Switch
          id="fromMe"
          checked={search?.fromMe === true}
          onCheckedChange={(event) => {
            navigate({
              search: (prev: CasesPageSearchDto) => ({
                ...prev,
                fromMe: event === true ? true : undefined,
              }),
            });
          }}
        />
        <Label htmlFor="fromMe" className={'cursor-pointer pr-2'}>
          Я создал или утвердил
        </Label>
      </div>
    </div>
  );
};

export { FromMeFilter };
