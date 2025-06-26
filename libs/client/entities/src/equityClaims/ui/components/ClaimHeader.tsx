import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { EquityClaim, EquityClaimStatuses } from '@urgp/shared/entities';

type ClaimHeaderProps = {
  claim?: EquityClaim;
  className?: string;
};

const ClaimHeader = (props: ClaimHeaderProps): JSX.Element | null => {
  const { claim, className } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'relative flex  flex-row items-center truncate ',
            // '-mx-4 -mt-4 w-[calc(100%+2rem)] px-4 py-2',
            className,
          )}
        >
          <p
            className={cn(
              'w-24 flex-grow truncate text-lg font-bold',
              claim?.claimStatus !== EquityClaimStatuses?.active &&
                'line-through',
            )}
          >
            {claim?.creditorName}
          </p>
          <p className="text-thin ml-2 flex-shrink-0">
            {claim?.claimSourceType?.name}
          </p>
          {/* <CircleCheck className="absolute right-1 top-1/2 size-10 -translate-y-1/2 text-teal-500/50" /> */}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[450px] flex-col gap-0">
            <div className="pb-2 font-bold">{claim?.creditorName}</div>
            {claim?.source && (
              <div className="flex items-start justify-between">
                <span>Источник данных:</span>
                <span className="text-muted-foreground ml-2 font-normal">
                  {claim?.source}
                </span>
              </div>
            )}
            {claim?.claimRegistryNum && (
              <div className="flex items-start justify-between">
                <span>№ требования в РТУС:</span>
                <span className="text-muted-foreground ml-2 font-normal">
                  {claim?.claimRegistryNum}
                </span>
              </div>
            )}
            {claim?.creditorRegistryNum && (
              <div className="flex items-start justify-between">
                <span>№ кредитора в РТУС:</span>
                <span className="text-muted-foreground ml-2 font-normal">
                  {claim?.creditorRegistryNum}
                </span>
              </div>
            )}
            {claim?.creditorDocuments && (
              <div className="flex items-start justify-between">
                <span>Документы:</span>
                <span className="text-muted-foreground ml-2 font-normal">
                  {claim?.creditorDocuments}
                </span>
              </div>
            )}
            {claim?.creditorAddress && (
              <div className="flex items-start justify-between">
                <span>Адрес:</span>
                <span className="text-muted-foreground ml-2 font-normal">
                  {claim?.creditorAddress}
                </span>
              </div>
            )}
            {claim?.creditorContacts && (
              <div className="flex items-start justify-between">
                <span>Контакты:</span>
                <span className="text-muted-foreground ml-2 font-normal">
                  {claim?.creditorContacts}
                </span>
              </div>
            )}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export { ClaimHeader };
