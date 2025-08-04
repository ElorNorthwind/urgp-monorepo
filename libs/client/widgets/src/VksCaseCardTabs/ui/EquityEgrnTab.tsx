import {
  cn,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { EquityObject } from '@urgp/shared/entities';

import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CardTab } from '@urgp/client/features';
import { format } from 'date-fns';
import { useEquityEgrnById } from '@urgp/client/entities';
import { is } from 'date-fns/locale';

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

  const { data, isLoading, isFetching } = useEquityEgrnById(
    equityObject?.id || 0,
    { skip: !equityObject?.id || equityObject?.id === 0 },
  );

  return (
    <CardTab
      label={label}
      className={className}
      titleClassName={titleClassName}
      contentClassName="p-0"
      // contentClassName={cn(
      //   'grid grid-cols-[auto_auto_auto_1fr] [&>*]:px-3 [&>*]:py-1 p-0',
      //   contentClassName,
      // )}
      accordionItemName={accordionItemName}
    >
      {isLoading || isFetching || !data ? (
        <Skeleton className={cn('h-8', className)} />
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <div
              className={cn(
                'grid grid-cols-[auto_auto_auto_1fr] p-0 [&>*]:px-3 [&>*]:py-1',
                contentClassName,
              )}
            >
              <div className="bg-muted-foreground/5 border-b border-r px-2 py-1 text-right font-bold">
                Дата:
              </div>
              <div className="flex items-start justify-start gap-2 truncate border-b p-1 ">
                <p className="my-auto w-full truncate font-light">
                  {data?.titleDate
                    ? format(data?.titleDate, 'dd.MM.yyyy')
                    : '-'}
                </p>
              </div>
              <div className="bg-muted-foreground/5 border-b border-l px-2 py-1 text-right font-bold">
                Номер:
              </div>
              <div className="flex items-start justify-start gap-2 truncate border-b border-l p-1 ">
                <p className="my-auto w-full truncate font-light">
                  {data?.titleNum || '-'}
                </p>
              </div>
              <div className="bg-muted-foreground/5  border-r px-2 py-1 text-right font-bold">
                Субъект:
              </div>
              <div className="col-span-3 flex items-start justify-start gap-2 truncate p-1">
                <p className="my-auto w-full truncate font-light">
                  {data?.holderName || 'Права не оформлены'}
                </p>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />
              <div className="flex max-w-[500px] flex-col gap-0">
                {data?.status && (
                  <div className="flex items-start justify-between">
                    <span>Статус:</span>
                    <span className="text-muted-foreground ml-2 font-normal">
                      {data?.status}
                    </span>
                  </div>
                )}
                {data?.titleDate && (
                  <div className="flex items-start justify-between">
                    <span>Дата права:</span>
                    <span className="text-muted-foreground ml-2 font-normal">
                      {format(data?.titleDate, 'dd.MM.yyyy')}
                    </span>
                  </div>
                )}
                {data?.titleNum && (
                  <div className="flex items-start justify-between">
                    <span>Номер:</span>
                    <span className="text-muted-foreground ml-2 font-normal">
                      {data?.titleNum}
                    </span>
                  </div>
                )}
                {data?.holderName && (
                  <div className="flex items-start justify-between">
                    <span>Субъект:</span>
                    <span className="text-muted-foreground ml-2 font-normal">
                      {data?.holderName}
                    </span>
                  </div>
                )}
              </div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}
    </CardTab>
  );
};

export { EquityEgrnTab };
