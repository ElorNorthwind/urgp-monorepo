import { cn, Skeleton } from '@urgp/client/shared';

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
          <div className="font-bold">{controlCase?.title}</div>
          <div className="border-foreground/20 text-muted-foreground  flex-shrink truncate border-l pl-2">
            {controlCase?.extra}
          </div>
        </div>

        <div className="max-h-50 line-clamp-4 overflow-hidden rounded-b border-t p-4">
          {controlCase?.notes}
        </div>
        {controlCase && (
          <div className="flex flex-row items-center gap-2 border-t p-4">
            <span className="text-xl font-semibold">Темы:</span>

            <CaseDirectionsList
              directions={controlCase?.directions}
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
        stage={operation}
        className="my-2 max-h-72 overflow-y-auto rounded-t shadow-sm"
        hover={false}
      />
    );
  }

  return null;
};

export { ControlFormDisplayElement };
