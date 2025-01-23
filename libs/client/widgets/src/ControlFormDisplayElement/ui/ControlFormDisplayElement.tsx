import { cn, Skeleton } from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';

import {
  CaseDirectionsList,
  StageItem,
  useCaseById,
  useOperationById,
} from '@urgp/client/entities';

type ControlFormDisplayElementProps = {
  entityType: 'case' | 'operation';
  entityId: number;
  className?: string;
};

const ControlFormDisplayElement = ({
  className,
  entityType,
  entityId,
}: ControlFormDisplayElementProps): JSX.Element | null => {
  const {
    data: operation,
    isLoading: isOperationLoading,
    isFetching: isOperationFetching,
  } = useOperationById(entityId, {
    skip: entityId === 0 || entityType !== 'operation',
  });
  const {
    data: controlCase,
    isLoading: isCaseLoading,
    isFetching: isCaseFetching,
  } = useCaseById(entityId, {
    skip: entityId === 0 || entityType !== 'case',
  });

  const isLoading =
    isOperationLoading ||
    isOperationFetching ||
    isCaseLoading ||
    isCaseFetching;

  if (isLoading) return <Skeleton className={cn('h-10 w-full', className)} />;

  if (entityType === 'case') {
    return (
      <div className="bg-sidebar/80 flex w-full flex-col overflow-hidden rounded-t shadow-sm">
        <div
          className={cn(
            'bg-muted-foreground/5 flex h-10 w-full items-center justify-center gap-2',
            className,
          )}
        >
          <div className="font-bold">{controlCase?.payload?.fio}</div>
          <div className="border-foreground/20 text-muted-foreground  flex-shrink truncate border-l pl-2">
            {controlCase?.payload?.adress}
          </div>
        </div>

        <div className="max-h-50 overflow-hidden rounded-b border-t p-4">
          {controlCase?.payload?.description}
        </div>
        {controlCase && (
          <div className="flex flex-row items-center gap-2 border-t p-4">
            <span className="text-xl font-semibold">Темы:</span>

            <CaseDirectionsList
              directions={controlCase?.payload?.directions}
              variant="list"
            />
          </div>
        )}
      </div>
    );
  }

  if (entityType === 'operation') {
    // TODO: maybe refactor me?
    return (
      <StageItem
        stage={operation as ControlStage}
        className="my-2 rounded-t shadow-sm"
        hover={false}
      />
    );
  }

  return null;
};

export { ControlFormDisplayElement };
