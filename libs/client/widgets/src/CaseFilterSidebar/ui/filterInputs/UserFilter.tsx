import { useLocation, useNavigate } from '@tanstack/react-router';
import { useCurrentUserSettings } from '@urgp/client/entities';
import { Button, CaseRoutes, cn, Skeleton } from '@urgp/client/shared';
import { CasesPageSearchDto } from '@urgp/shared/entities';

type UserFilterProps = {
  className?: string;
  variant?: 'full' | 'mini';
};

const UserFilter = (props: UserFilterProps): JSX.Element | null => {
  const { className, variant = 'full' } = props;
  const pathname = useLocation().pathname as CaseRoutes;
  const navigate = useNavigate({ from: pathname });
  const {
    data: userSettings,
    isLoading,
    isFetching,
  } = useCurrentUserSettings();

  if (isLoading || isFetching)
    return (
      <Skeleton
        className={cn(variant === 'full' ? 'h-10' : 'h-8', 'w-12', className)}
      />
    );

  if (
    !userSettings?.casesFilter ||
    Object.keys(userSettings.casesFilter).length === 0
  ) {
    return null;
  }

  return (
    <Button
      type="button"
      variant={variant === 'full' ? 'default' : 'ghost'}
      className={cn(
        'flex flex-row p-2',
        variant === 'full' ? 'gap-2' : 'h-8 gap-1',
        className,
      )}
      onClick={() =>
        navigate({
          search: (prev: CasesPageSearchDto) => ({
            selectedCase: prev.selectedCase,
            sortKey: prev.sortKey,
            sortDir: prev.sortDir,
            ...userSettings.casesFilter,
          }),
        })
      }
    >
      <span>Мой фильтр</span>
    </Button>
  );
};

export { UserFilter };
