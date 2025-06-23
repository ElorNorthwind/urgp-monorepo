import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { Button, CaseRoutes, cn } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';
import { X } from 'lucide-react';

type ResetFilterProps = {
  className?: string;
  variant?: 'full' | 'mini';
};

const ResetFilter = (props: ResetFilterProps): JSX.Element => {
  const { className, variant = 'full' } = props;
  const pathname = useLocation().pathname as CaseRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;

  const paramLength = Object.keys(search).filter(
    (key) => !['selectedCase', 'sortKey', 'sortDir'].includes(key),
  ).length;

  return (
    <Button
      type="button"
      variant={variant === 'full' ? 'default' : 'ghost'}
      className={cn(
        'flex flex-row p-2',
        variant === 'full' ? 'gap-2' : 'h-8 gap-1',
        !paramLength && 'hidden',
        className,
      )}
      disabled={!paramLength}
      onClick={() =>
        navigate({
          search: (prev: CasesPageSearchDto) => ({
            selectedCase: prev.selectedCase,
            sortKey: prev.sortKey,
            sortDir: prev.sortDir,
          }),
        })
      }
    >
      <span>
        {variant === 'full' ? `Снять фильтры: ${paramLength}` : `Сброс`}
      </span>
      <X className="size-4" />
    </Button>
  );
};

export { ResetFilter };
