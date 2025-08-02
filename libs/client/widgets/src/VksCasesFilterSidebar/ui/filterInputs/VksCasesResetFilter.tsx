import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { Button, cn, VksRoutes } from '@urgp/client/shared';
import { CasesPageSearchDto, VksCasesPageSearch } from '@urgp/shared/entities';
import { X } from 'lucide-react';

type ResetFilterProps = {
  className?: string;
  variant?: 'full' | 'mini';
};

const VksCasesResetFilter = (props: ResetFilterProps): JSX.Element => {
  const { className, variant = 'full' } = props;
  const pathname = useLocation().pathname as VksRoutes;

  const navigate = useNavigate({ from: pathname });
  const search = getRouteApi(pathname).useSearch() as CasesPageSearchDto;

  const paramLength = Object.keys(search).filter(
    (key) =>
      !['selectedCase', 'dateFrom', 'dateTo', 'sortKey', 'sortDir'].includes(
        key,
      ),
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
          search: (prev: VksCasesPageSearch) => ({
            selectedCase: prev.selectedCase,
            dateFrom: prev.dateFrom,
            dateTo: prev.dateTo,
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

export { VksCasesResetFilter };
