import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { EquityClaim } from '@urgp/shared/entities';
import { format } from 'date-fns';

type ClaimBasisProps = {
  claim?: EquityClaim;
  className?: string;
};

const ClaimBasis = (props: ClaimBasisProps): JSX.Element | null => {
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
          <div className="w-24 flex-shrink-0 font-semibold">Включение:</div>
          <div className="flex-shrink-0">
            {claim?.claimRegistryDate
              ? format(claim?.claimRegistryDate, 'dd.MM.yyyy')
              : 'без даты'}
          </div>
          {claim?.legalAct && (
            <div className="w-0 flex-grow font-thin">{claim?.legalAct}</div>
          )}
          {claim?.basis && (
            <div className="w-0 flex-grow font-thin">{claim?.basis}</div>
          )}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[300px] flex-col gap-0">
            {claim?.claimRegistryDate && (
              <div className="flex items-start justify-between">
                <span>Требование внесено в реестр:</span>
                <span className="text-muted-foreground ml-2 font-normal">
                  {format(claim?.claimRegistryDate, 'dd.MM.yyyy')}
                </span>
              </div>
            )}
            {claim?.basis && (
              <div className="flex flex-col items-start justify-between">
                <span>Основание:</span>
                <span className="text-muted-foreground font-normal">
                  {claim?.basis}
                </span>
              </div>
            )}
            {claim?.legalAct && (
              <div className="flex flex-col items-start justify-between">
                <span>Решение суда:</span>
                <span className="text-muted-foreground font-normal">
                  {claim?.legalAct}
                </span>
              </div>
            )}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export { ClaimBasis };
