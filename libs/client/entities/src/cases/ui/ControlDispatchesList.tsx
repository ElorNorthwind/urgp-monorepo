import {
  cn,
  Skeleton,
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from '@urgp/client/shared';
import { Fragment } from 'react/jsx-runtime';
import { EditDispatchButton } from '../../operations';
import { isBefore } from 'date-fns';
import { useMemo } from 'react';
import { OperationFull } from '@urgp/shared/entities';
import { CirclePower, Repeat } from 'lucide-react';

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
                {d?.controlTo?.fio}
              </div>

              <div
                className={cn(
                  paddingStyle,
                  'bg-background group flex flex-row items-center gap-1',
                  sameController ? 'col-span-2' : 'col-span-1 border-r',
                  index < dispatches.length - 1 && !d.notes && 'border-b',
                )}
              >
                <EditDispatchButton controlDispatch={d} />
                {d?.extra &&
                  ![
                    'Без переноса срока',
                    'Первично установленный срок',
                  ].includes(d?.extra) && (
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Repeat className="text-muted-foreground size-4" />
                      </TooltipTrigger>

                      <TooltipContent side="top">
                        <span className="font-bold">Причина переноса: </span>
                        <span>{d?.extra}</span>
                      </TooltipContent>
                    </Tooltip>
                  )}
              </div>
              {!sameController && (
                <div
                  className={cn(
                    paddingStyle,
                    'bg-muted-foreground/5 flex flex-row items-center gap-1',
                    index < dispatches.length - 1 && !d.notes && 'border-b',
                  )}
                >
                  <span>{'от: ' + d?.controlFrom?.fio}</span>
                  <CirclePower className="text-muted-foreground size-4" />
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
