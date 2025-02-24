import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseFull, CONTROL_THRESHOLD } from '@urgp/shared/entities';

import { CardTab } from '@urgp/client/features';
import { Fragment, useMemo } from 'react';
import { isBefore } from 'date-fns';
import {
  CreateDispatchButton,
  EditDispatchButton,
} from '@urgp/client/entities';
import { BedSingle, CirclePower, Repeat } from 'lucide-react';

type DispatchesTabProps = {
  controlCase?: CaseFull;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const DispatchesTab = (props: DispatchesTabProps): JSX.Element | null => {
  const {
    controlCase,
    className,
    label = 'Поручения',
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  const sortedDispatches = useMemo(() => {
    if (!controlCase || !controlCase?.dispatches) return [];
    return [...controlCase?.dispatches].sort((a, b) => {
      const dif1 =
        (a?.controlFrom?.priority || 0) - (b?.controlFrom?.priority || 0);
      const dif2 = isBefore(a?.dueDate || 0, b?.dueDate || 0);
      return dif1 > 0 ? 1 : dif1 < 0 ? -1 : dif2 ? -1 : 1;
    });
  }, [controlCase?.dispatches]);

  return (
    <CardTab
      label={label}
      button={
        <CreateDispatchButton
          className="absolute right-6 top-3 h-8 px-2 py-1"
          caseId={controlCase?.id}
        />
      }
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn(
        'p-0 grid grid-cols-[auto_1fr_auto] overflow-hidden',
        contentClassName,
      )}
      accordionItemName={accordionItemName}
    >
      {sortedDispatches?.length === 0 ? (
        <div className="text-muted-foreground flex flex-row items-center gap-1 p-2">
          <BedSingle className="size-4" />
          <span>Нет поручений</span>
        </div>
      ) : (
        sortedDispatches.map((d, index) => {
          const sameController = d?.controlTo?.id === d?.controlFrom?.id;
          return (
            <Fragment key={d.id}>
              <div
                className={cn(
                  'border-r px-4 py-1',
                  'bg-muted-foreground/5',
                  index < sortedDispatches.length - 1 && !d.notes && 'border-b',
                )}
              >
                {d?.controlTo?.fio}
              </div>

              <div
                className={cn(
                  'bg-background group flex flex-row items-center gap-1 px-4 py-1',
                  sameController ? 'col-span-2' : 'col-span-1 border-r',
                  index < sortedDispatches.length - 1 && !d.notes && 'border-b',
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
                    'bg-muted-foreground/5 flex flex-row items-center gap-1 px-4 py-1',
                    index < sortedDispatches.length - 1 &&
                      !d.notes &&
                      'border-b',
                  )}
                >
                  <span>{'от: ' + d?.controlFrom?.fio}</span>
                  {d?.controlFrom?.priority &&
                  d?.controlFrom?.priority >= CONTROL_THRESHOLD ? (
                    <CirclePower className="text-muted-foreground size-4" />
                  ) : (
                    <></>
                  )}
                </div>
              )}
              {d?.notes && (
                <div
                  className={cn(
                    index < sortedDispatches?.length - 1 && 'border-b',
                    'text-muted-foreground bg-background/50 col-span-3 border-t px-4 py-1 text-xs',
                  )}
                >
                  {d?.notes}
                </div>
              )}
            </Fragment>
          );
        })
      )}
    </CardTab>
  );
};

export { DispatchesTab };
