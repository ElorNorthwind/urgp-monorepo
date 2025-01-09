import { cn } from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Fragment } from 'react/jsx-runtime';

type CaseDispatchesListProps = {
  dispatches?: Case['dispatches'];
  className?: string;
  compact?: boolean;
  label?: string;
};

const CaseDispatchesList = (props: CaseDispatchesListProps): JSX.Element => {
  const { className, dispatches = [], compact = false, label } = props;
  const paddingStyle = cn(compact ? 'px-2' : 'px-4 py-1');

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
          const sameController = d?.executor?.id === d.controller?.id;
          return (
            <Fragment key={d.id}>
              <div
                className={cn(
                  paddingStyle,
                  index < dispatches.length - 1 && 'border-b',
                  'border-r',
                  'bg-muted-foreground/5',
                )}
              >
                {d.executor.fio}
              </div>
              <div
                className={cn(
                  paddingStyle,
                  index < dispatches.length - 1 && 'border-b',
                  'bg-background',
                  sameController ? 'col-span-2' : 'col-span-1 border-r',
                )}
              >
                <span>{d.dueDate ? format(d.dueDate, 'dd.MM.yyyy') : '-'}</span>
              </div>
              {!sameController && (
                <div
                  className={cn(
                    paddingStyle,
                    index < dispatches.length - 1 && 'border-b',
                    'bg-muted-foreground/5',
                  )}
                >
                  {'от: ' + d.controller.fio}
                </div>
              )}
            </Fragment>
          );
        })}
      </div>
    </div>
  );
};

export { CaseDispatchesList };
