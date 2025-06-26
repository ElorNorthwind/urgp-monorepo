import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import {
  cn,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { EquityClaim } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { equityClaimItemTypeStyles } from '../../equityClassificators';
import { ClaimHeader } from './components/ClaimHeader';
import { ClaimItem } from './components/ClaimItem';
import { ClaimBasis } from './components/ClaimBasis';
import { ClaimNotes } from './components/ClaimNotes';
import { ClaimChange } from './components/ClaimChange';
import { ClaimExclusion } from './components/ClaimExclusion';
import { ClaimSettlement } from './components/ClaimSettlement';
import { ClaimIdentification } from './components/ClaimIdentification';
import { ClaimMoney } from './components/ClaimMoney';

type EquityClaimElementProps = {
  claim?: EquityClaim;
  className?: string;
};

const EquityClaimElement = (
  props: EquityClaimElementProps,
): JSX.Element | null => {
  const { claim, className } = props;

  const { icon: TypeIcon, iconStyle } =
    equityClaimItemTypeStyles?.[claim?.claimItemType?.id || 0] ||
    Object.values(equityClaimItemTypeStyles)[0];

  return (
    <div
      className={cn(
        'group relative flex w-full flex-col gap-2 border-b p-4 last:border-b-0',
        !claim?.isRelevant && 'opacity-50',
        className,
      )}
    >
      <ClaimHeader
        claim={claim}
        className="bg-muted-foreground/10 -mx-4 -mt-4 w-[calc(100%+2rem)] px-4 py-2 "
      />
      <ClaimItem claim={claim} />
      <Separator className="" />
      <ClaimBasis claim={claim} />
      {claim?.notes && <ClaimNotes claim={claim} />}
      {claim?.changeBasis && <ClaimChange claim={claim} />}
      {(claim?.claimExclusionReason || claim?.claimExclusionDate) && (
        <ClaimExclusion claim={claim} />
      )}
      {(claim?.claimSettlementReason || claim?.claimSettlementDate) && (
        <ClaimSettlement claim={claim} />
      )}
      <Separator />
      <ClaimMoney claim={claim} />
      {claim?.identificationNotes && (
        <ClaimIdentification
          claim={claim}
          className="-mx-4 -mb-4 w-[calc(100%+2rem)] bg-yellow-500/10 px-4 py-2"
        />
      )}
    </div>
  );
};

export { EquityClaimElement };
