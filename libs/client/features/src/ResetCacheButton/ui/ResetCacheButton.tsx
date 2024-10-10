import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { useResetRenovationCache } from '@urgp/client/entities';
import {
  Button,
  cn,
  selectCurrentUser,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { DatabaseZap } from 'lucide-react';
import { useSelector } from 'react-redux';
import { toast } from 'sonner';

type ResetCacheButtonProps = {
  className?: string;
};

const ResetCacheButton = ({
  className,
}: ResetCacheButtonProps): JSX.Element => {
  const user = useSelector(selectCurrentUser);
  const [resetCache, { isLoading: isUpdateLoading }] =
    useResetRenovationCache();

  if (!(user?.roles.includes('admin') || user?.roles.includes('editor'))) {
    return <></>;
  }
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant={'ghost'}
          disabled={isUpdateLoading}
          className={cn('p-2', className)}
          onClick={() =>
            resetCache()
              .unwrap()
              .then(() => {
                toast.success('Кэш сброшен');
              })
              .catch(() => toast.error('Не удалось сбросить кэш'))
          }
        >
          <DatabaseZap className="text-muted-foreground h-8 w-8" />
        </Button>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="p-2" side="left">
          <TooltipArrow />
          Сбросить кэш
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export { ResetCacheButton };
