import { cn } from '@urgp/client/shared';
import { EquityObject } from '@urgp/shared/entities';

import { EquityClaimElement, useEquityClaims } from '@urgp/client/entities';
import { CardTab } from '@urgp/client/features';
import { Gift } from 'lucide-react';

type EquityClaimsTabPrArchiveops = {
  equityObject?: EquityObject;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const EquityClaimsArchiveTab = (
  props: EquityClaimsTabPrArchiveops,
): JSX.Element | null => {
  const {
    equityObject,
    className,
    label = 'Архив требований',
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

  if (
    !equityClaims ||
    equityClaims?.filter((c) => c?.isRelevant === false)?.length === 0
  )
    return null;

  return (
    <CardTab
      label={label}
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn('p-0 overflow-hidden', contentClassName)}
      accordionItemName={accordionItemName}
    >
      <div className="">
        {equityClaims
          .filter((c) => c?.isRelevant === false)
          .map((claim, index) => {
            return <EquityClaimElement claim={claim} key={claim.id} />;
          })}
      </div>
    </CardTab>
  );
};

export { EquityClaimsArchiveTab };
