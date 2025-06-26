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
import { isBefore } from 'date-fns';
import {
  CreateDispatchButton,
  EditDispatchButton,
  EquityClaimElement,
  useEquityClaims,
} from '@urgp/client/entities';
import { BedSingle, CirclePower, Gift, Repeat } from 'lucide-react';

type EquityClaimsTabProps = {
  equityObject?: EquityObject;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const EquityClaimsTab = (props: EquityClaimsTabProps): JSX.Element | null => {
  const {
    equityObject,
    className,
    label = 'Требования',
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  const {
    data: equityClaims,
    isLoading,
    isFetching,
  } = useEquityClaims(equityObject?.id || 0, {
    skip: !equityObject?.id || equityObject?.id === 0,
  });

  // const firstClaim = equityClaims && equityClaims.find((c) => c?.isRelevant);

  return (
    <CardTab
      label={label}
      // button={
      //   <div className="pointer-events-none truncate bg-blue-500">
      //     <p className="w-46 pointer-events-none truncate bg-red-500">
      //       {firstClaim?.creditorName}
      //     </p>
      //     <p>{firstClaim?.source}</p>
      //   </div>
      // }
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn('p-0 overflow-hidden', contentClassName)}
      accordionItemName={accordionItemName}
    >
      {/* {isLoading || isFetching && <Skeleton className="h-10 w-full" />} */}

      {!equityClaims ||
      equityClaims?.filter((c) => c?.isRelevant)?.length === 0 ? (
        <div className="text-muted-foreground flex flex-row items-center gap-1 p-2">
          <Gift className="size-4" />
          <span>Нет действующих требований</span>
        </div>
      ) : (
        <div className="">
          {equityClaims
            .filter((c) => c.isRelevant)
            .map((claim, index) => {
              return <EquityClaimElement claim={claim} key={claim.id} />;
            })}
          {/* {equityClaims.map((claim, index) => {
            return (
              <Fragment key={claim.id}>
                <div
                  className={cn(
                    'border-r px-4 py-1',
                    'bg-muted-foreground/5',
                    index < equityClaims.length - 1 &&
                      !claim.notes &&
                      'border-b',
                  )}
                >
                  {claim?.creditorName}
                </div>

                <div
                  className={cn(
                    'bg-background group flex flex-row items-center gap-1 px-4 py-1',
                    'col-span-2',
                    index < equityClaims.length - 1 &&
                      !claim.notes &&
                      'border-b',
                  )}
                >
                  {claim?.claimItemType?.name + ' | '}
                  {claim?.source}
                </div>

                {claim?.notes && (
                  <div
                    className={cn(
                      index < equityClaims.length - 1 && 'border-b',
                      'text-muted-foreground bg-background/50 col-span-3 border-t px-4 py-1 text-xs',
                    )}
                  >
                    {claim?.notes}
                  </div>
                )}
              </Fragment>
            );
          })} */}
        </div>
      )}
    </CardTab>
  );
};

export { EquityClaimsTab };
