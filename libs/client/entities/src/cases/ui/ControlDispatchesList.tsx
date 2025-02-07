import { cn, Skeleton, Tooltip, TooltipTrigger } from '@urgp/client/shared';
import { Fragment } from 'react/jsx-runtime';
import { EditDispatchButton } from '../../operations';
import { isBefore } from 'date-fns';
import { useMemo } from 'react';
import { OperationFull } from '@urgp/shared/entities';

type ControlDispatchesListProps = {
  dispatches?: OperationFull[];
  isLoading?: boolean;
  className?: string;
  compact?: boolean;
  label?: string;
};

const ControlDispatchesList = (
  props: ControlDispatchesListProps,
): JSX.Element => {
  const {
    className,
    dispatches = [],
    compact = false,
    label,
    isLoading = false,
  } = props;
  const paddingStyle = cn(compact ? 'px-2' : 'px-4 py-1');

  const sortedDispatches = useMemo(() => {
    return [...dispatches].sort((a, b) => {
      const dif1 =
        (a?.controlFrom?.priority || 0) - (b?.controlFrom?.priority || 0);
      const dif2 = isBefore(a?.dueDate || 0, b?.dueDate || 0);
      return dif1 > 0 ? 1 : dif1 < 0 ? -1 : dif2 ? -1 : 1;
    });
  }, [dispatches]);

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!dispatches || dispatches?.length === 0) {
    return <div>Нет поручений</div>;
  }

  return (
    <div className="flex flex-col gap-2 ">
      {label && <div className="font-bold">{label}</div>}
      <div
        className={cn(
          'grid grid-cols-[auto_1fr_auto] overflow-hidden rounded-lg border',
          className,
        )}
      >
        {sortedDispatches.map((d, index) => {
          const sameController = d?.controlTo?.id === d?.controlFrom?.id;
          return (
            <Fragment key={d.id}>
              <div
                className={cn(
                  paddingStyle,
                  'border-r',
                  'bg-muted-foreground/5',
                  index < dispatches.length - 1 && !d.notes && 'border-b',
                )}
              >
                {d?.controlFrom?.fio}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      paddingStyle,
                      'bg-background group flex flex-row items-center gap-1',
                      sameController ? 'col-span-2' : 'col-span-1 border-r',
                      index < dispatches.length - 1 && !d.notes && 'border-b',
                    )}
                  >
                    <EditDispatchButton controlDispatch={d} />
                  </div>
                </TooltipTrigger>
                {/* {d.payload.dueDateChanged && (
                  <TooltipContent side="top">
                    <span className="font-bold">Причина переноса: </span>
                    <span>{d.payload.dateDescription}</span>
                  </TooltipContent>
                )} */}
              </Tooltip>
              {!sameController && (
                <div
                  className={cn(
                    paddingStyle,
                    'bg-muted-foreground/5',
                    index < dispatches.length - 1 && !d.notes && 'border-b',
                  )}
                >
                  {'от: ' + d?.controlFrom?.fio}
                </div>
              )}
              {d?.notes && (
                <div
                  className={cn(
                    paddingStyle,
                    index < dispatches.length - 1 && 'border-b',
                    'text-muted-foreground bg-background/50 col-span-3 border-t text-xs',
                  )}
                >
                  {d?.notes}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export { ControlDispatchesList };
