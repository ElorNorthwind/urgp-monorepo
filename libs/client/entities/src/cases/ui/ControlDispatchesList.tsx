import { cn, Skeleton } from '@urgp/client/shared';
import { EditDispatchButton } from '@urgp/client/widgets';
import { Case, ControlDispatch } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Fragment } from 'react/jsx-runtime';

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
        {dispatches.map((d, index) => {
          const sameController =
            d?.payload?.executor?.id === d.payload?.controller?.id;
          return (
            <Fragment key={d.id}>
              <div
                className={cn(
                  paddingStyle,
                  'border-r',
                  'bg-muted-foreground/5',
                )}
              >
                {d.payload?.executor?.fio}
              </div>
              <div
                className={cn(
                  paddingStyle,
                  'bg-background relative',
                  sameController ? 'col-span-2' : 'col-span-1 border-r',
                )}
              >
                <span>
                  {d.payload?.dueDate
                    ? format(d.payload?.dueDate, 'dd.MM.yyyy')
                    : '-'}
                </span>
                <EditDispatchButton
                  editDispatch={d}
                  className="absolute right-0 top-0"
                />
              </div>
              {!sameController && (
                <div className={cn(paddingStyle, 'bg-muted-foreground/5')}>
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
