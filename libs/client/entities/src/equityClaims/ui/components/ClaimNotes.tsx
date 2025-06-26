import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { EquityClaim } from '@urgp/shared/entities';

type ClaimNotesProps = {
  claim?: EquityClaim;
  className?: string;
};

const ClaimNotes = (props: ClaimNotesProps): JSX.Element | null => {
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
          <div className="w-24 flex-shrink-0 font-semibold">Примечания:</div>
          <div className="w-0 flex-grow font-thin">{claim?.notes}</div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[400px] flex-col gap-0">
            <div className="flex flex-col items-start justify-between">
              <span>Примечания по требованию в РТУС:</span>
              <span className="text-muted-foreground font-normal">
                {claim?.notes}
              </span>
            </div>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
};

export { ClaimNotes };
