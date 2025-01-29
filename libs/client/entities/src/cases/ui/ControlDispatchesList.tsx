import {
  cn,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { ControlDispatch } from '@urgp/shared/entities';
import { Fragment } from 'react/jsx-runtime';
import { EditDispatchButton } from '../../operations';
import { isBefore } from 'date-fns';
import { useMemo } from 'react';

type ControlDispatchesListProps = {
  dispatches?: ControlDispatch[];
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
        (a?.payload?.controller?.priority || 0) -
        (b?.payload?.controller?.priority || 0);
      const dif2 = isBefore(a?.payload?.dueDate || 0, b?.payload?.dueDate || 0);
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
          const sameController =
            d?.payload?.executor?.id === d.payload?.controller?.id;
          return (
            <Fragment key={d.id}>
              <div
                className={cn(
                  paddingStyle,
                  'border-r',
                  'bg-muted-foreground/5',
                  index < dispatches.length - 1 &&
                    !d.payload?.description &&
                    'border-b',
                )}
              >
                {d.payload?.executor?.fio}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      paddingStyle,
                      'bg-background group flex flex-row items-center gap-1',
                      sameController ? 'col-span-2' : 'col-span-1 border-r',
                      index < dispatches.length - 1 &&
                        !d.payload?.description &&
                        'border-b',
                    )}
                  >
                    <EditDispatchButton controlDispatch={d} />
                  </div>
                </TooltipTrigger>
                {d.payload.dueDateChanged && (
                  <TooltipContent side="top">
                    <span className="font-bold">Причина переноса: </span>
                    <span>{d.payload.dateDescription}</span>
                  </TooltipContent>
                )}
              </Tooltip>
              {!sameController && (
                <div
                  className={cn(
                    paddingStyle,
                    'bg-muted-foreground/5',
                    index < dispatches.length - 1 &&
                      !d.payload?.description &&
                      'border-b',
                  )}
                >
                  {'от: ' + d.payload?.controller?.fio}
                </div>
              )}
              {d.payload?.description && (
                <div
                  className={cn(
                    paddingStyle,
                    index < dispatches.length - 1 && 'border-b',
                    'text-muted-foreground bg-background/50 col-span-3 border-t text-xs',
                  )}
                >
                  {d.payload?.description}
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
