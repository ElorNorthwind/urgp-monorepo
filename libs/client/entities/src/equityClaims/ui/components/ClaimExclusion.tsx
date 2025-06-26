import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { EquityClaim } from '@urgp/shared/entities';
import { format } from 'date-fns';

type ClaimExclusionProps = {
  claim?: EquityClaim;
  className?: string;
};

const ClaimExclusion = (props: ClaimExclusionProps): JSX.Element | null => {
  const { claim, className } = props;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div
          className={cn(
            'flex w-full flex-row items-center justify-start gap-2 truncate',
            '[&>*]:truncate [&>*]:border-l [&>*]:pl-2',
            'first:[&>*]:border-l-0 first:[&>*]:pl-0',
            className,
          )}
        >
          <div className="w-24 flex-shrink-0 font-semibold">Исключение:</div>
          <div className="flex-shrink-0">
            {claim?.claimExclusionDate
              ? format(claim?.claimExclusionDate, 'dd.MM.yyyy')
              : 'без даты'}
          </div>
          <div className="w-0 flex-grow font-thin">
            {claim?.claimExclusionReason}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[400px] flex-col gap-0">
            {claim?.claimExclusionDate && (
              <div className="flex items-start justify-between">
                <span>Запись об исключении требования:</span>
                <span className="text-muted-foreground ml-2 font-normal">
                  {format(claim?.claimExclusionDate, 'dd.MM.yyyy')}
                </span>
              </div>
            )}
            {claim?.claimExclusionReason && (
              <div className="flex flex-col items-start justify-between">
                <span>Причины исключения:</span>
                <span className="text-muted-foreground font-normal">
                  {claim?.claimExclusionReason}
                </span>
              </div>
            )}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export { ClaimExclusion };
