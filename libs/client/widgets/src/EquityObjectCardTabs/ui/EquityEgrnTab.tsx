import {
  cn,
  ScrollArea,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import {
  CaseFull,
  CONTROL_THRESHOLD,
  EquityObject,
} from '@urgp/shared/entities';

import { CardTab } from '@urgp/client/features';
import { Fragment, useMemo } from 'react';
import { format, isBefore } from 'date-fns';
import {
  CreateDispatchButton,
  EditDispatchButton,
  EquityClaimElement,
  useEquityClaims,
} from '@urgp/client/entities';
import { BedSingle, CirclePower, Gift, Repeat } from 'lucide-react';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';

type EquityEgrnTabProps = {
  equityObject?: EquityObject;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const EquityEgrnTab = (props: EquityEgrnTabProps): JSX.Element | null => {
  const {
    equityObject,
    className,
    label = 'Права по ЕГРН',
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  return (
    <CardTab
      label={label}
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn(
        'grid grid-cols-[auto_auto_auto_1fr] [&>*]:px-3 [&>*]:py-1 p-0',
        contentClassName,
      )}
      accordionItemName={accordionItemName}
    >
      <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
        Дата:
      </div>
      <div className="flex items-start justify-start gap-2 truncate border-b p-1 ">
        <p className="my-auto w-full truncate font-light">
          {equityObject?.egrnTitleDate
            ? format(equityObject?.egrnTitleDate, 'dd.MM.yyyy')
            : '-'}
        </p>
      </div>
      <div className="bg-muted-foreground/5 border-b border-l px-2 py-1 text-right font-bold">
        Номер:
      </div>
      <div className="flex items-start justify-start gap-2 truncate border-b border-l p-1 ">
        <p className="my-auto w-full truncate font-light">
          {equityObject?.egrnTitleNum || '-'}
        </p>
      </div>
      <div className="bg-muted-foreground/5  border-r px-2 py-1 text-right font-bold">
        Субъект:
      </div>
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="col-span-3 flex items-start justify-start gap-2 truncate p-1">
            <p className="my-auto w-full truncate font-light">
              {equityObject?.egrnHolderName || '-'}
            </p>
          </div>
        </TooltipTrigger>
        <TooltipPortal>
          <TooltipContent side="bottom">
            <TooltipArrow />
            <div className="flex max-w-[500px] flex-col gap-0">
              {equityObject?.egrnStatus && (
                <div className="flex items-start justify-between">
                  <span>Статус:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {equityObject?.egrnStatus}
                  </span>
                </div>
              )}
              {equityObject?.egrnTitleDate && (
                <div className="flex items-start justify-between">
                  <span>Дата права:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {format(equityObject?.egrnTitleDate, 'dd.MM.yyyy')}
                  </span>
                </div>
              )}
              {equityObject?.egrnTitleNum && (
                <div className="flex items-start justify-between">
                  <span>Номер:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {equityObject?.egrnTitleNum}
                  </span>
                </div>
              )}
              {equityObject?.egrnHolderName && (
                <div className="flex items-start justify-between">
                  <span>Субъект:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {equityObject?.egrnHolderName}
                  </span>
                </div>
              )}
            </div>
          </TooltipContent>
        </TooltipPortal>
      </Tooltip>
    </CardTab>
  );
};

export { EquityEgrnTab };
