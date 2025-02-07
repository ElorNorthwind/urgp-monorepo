import { cn, Skeleton } from '@urgp/client/shared';
import { OperationFull } from '@urgp/shared/entities';
import { format } from 'date-fns';

import { Fragment } from 'react/jsx-runtime';

type RemindersListProps = {
  reminders?: OperationFull[];
  isLoading?: boolean;
  className?: string;
  compact?: boolean;
  label?: string;
};

const RemindersList = (props: RemindersListProps): JSX.Element => {
  const {
    className,
    reminders = [],
    compact = false,
    label,
    isLoading = false,
  } = props;
  const paddingStyle = cn(compact ? 'px-2' : 'px-4 py-1');

  // onClick={() => dispatch(setEditDispatch(editDispatch))}

  if (isLoading) {
    return <Skeleton className="h-10 w-full" />;
  }

  if (!reminders || reminders?.length === 0) {
    return <div>Никто не отслеживает</div>;
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
        {reminders.map((rem, index) => {
          return (
            <Fragment key={rem.id}>
              <div
                className={cn(
                  paddingStyle,
                  'border-r',
                  index === reminders.length - 1 ? 'border-b-0' : 'border-b',
                  'bg-muted-foreground/5',
                )}
              >
                {rem?.controlFrom?.fio}
              </div>
              <div
                className={cn(
                  paddingStyle,
                  index === reminders.length - 1 ? 'border-b-0' : 'border-b',
                  'bg-background',
                  'col-span-1 border-r',
                  rem?.doneDate && 'line-through',
                )}
              >
                {'следит с ' +
                  (rem.createdAt ? format(rem.createdAt, 'dd.MM.yyyy') : '-')}
              </div>
              {rem?.doneDate ? (
                <div
                  className={cn(
                    paddingStyle,
                    index === reminders.length - 1 ? 'border-b-0' : 'border-b',
                    'bg-muted-foreground/5',
                  )}
                >
                  {'не следит с ' + format(rem?.doneDate, 'dd.MM.yyyy')}
                </div>
              ) : (
                <div
                  className={cn(
                    paddingStyle,
                    index === reminders.length - 1 ? 'border-b-0' : 'border-b',
                    'bg-muted-foreground/5',
                  )}
                >
                  {rem?.updatedAt
                    ? 'видел ' + format(rem?.updatedAt, 'dd.MM.yyyy HH:mm')
                    : 'еще не видел'}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export { RemindersList };
