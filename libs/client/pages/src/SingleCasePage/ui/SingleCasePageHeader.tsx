import { useRouter } from '@tanstack/react-router';
import {
  Button,
  cn,
  Separator,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseClasses, CaseFull } from '@urgp/shared/entities';
import { SquareArrowLeft } from 'lucide-react';

type SingleCasePageHeaderProps = {
  controlCase?: CaseFull;
  className?: string;
};

const SingleCasePageHeader = ({
  controlCase,
  className,
}: SingleCasePageHeaderProps): JSX.Element => {
  const router = useRouter();

  return (
    <div className={cn('w-full', className)}>
      {!controlCase ? (
        <Skeleton className="h-10 w-full" />
      ) : (
        <div className="flex w-full flex-row justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">
              {controlCase?.title}
            </h2>
            <p className="text-muted-foreground">
              {controlCase?.class === CaseClasses.problem
                ? 'системная проблема'
                : controlCase?.extra}
            </p>
          </div>
          <Tooltip>
            <TooltipTrigger>
              <Button
                role="button"
                variant="ghost"
                size="icon"
                className="size-12 p-2"
                onClick={() => router.history.back()}
              >
                <SquareArrowLeft className="text-sidebar-foreground size-10 opacity-30" />
              </Button>
            </TooltipTrigger>
            <TooltipContent side="left" sideOffset={4}>
              Назад
            </TooltipContent>
          </Tooltip>
        </div>
      )}
      <Separator className="my-6" />
    </div>
  );
};

export { SingleCasePageHeader };
