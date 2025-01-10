import {
  Button,
  cn,
  setEditDispatch,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { EditDispatchButton } from '@urgp/client/widgets';
import { Case, ControlDispatch } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { CalendarCog, Repeat, Replace } from 'lucide-react';
import { useDispatch } from 'react-redux';
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
  const dispatch = useDispatch();
  const i = useUserAbility();

  // onClick={() => dispatch(setEditDispatch(editDispatch))}

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
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className={cn(
                      paddingStyle,
                      'bg-background group flex flex-row items-center gap-1',
                      sameController ? 'col-span-2' : 'col-span-1 border-r',
                    )}
                  >
                    {i.can('update', d) ? (
                      <Button
                        variant="link"
                        className="flex h-5 flex-row gap-2 p-0"
                        onClick={() => dispatch(setEditDispatch(d))}
                      >
                        <span>
                          {d.payload?.dueDate
                            ? format(d.payload?.dueDate, 'dd.MM.yyyy')
                            : '-'}
                        </span>
                        {d.payload.dueDateChanged && (
                          <Repeat className="size-4 opacity-50" />
                        )}
                        <CalendarCog
                          className={cn('hidden size-4 group-hover:block')}
                        />
                      </Button>
                    ) : (
                      <>
                        <span>
                          {d.payload?.dueDate
                            ? format(d.payload?.dueDate, 'dd.MM.yyyy')
                            : '-'}
                        </span>
                        {d.payload.dueDateChanged && (
                          <Replace className="size-3" />
                        )}
                      </>
                    )}
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
