import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseOrPending } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { viewStatusStyles } from '../../../config/caseStyles';

function ViewStatusCell(
  props: CellContext<CaseOrPending, string>,
): JSX.Element {
  const viewStatus = props.row.original?.viewStatus;
  const { icon: StatusIcon, iconStyle } =
    viewStatusStyles?.[viewStatus] || Object.entries(viewStatusStyles)[0];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        {StatusIcon && (
          <StatusIcon
            className={cn(
              'size-8 flex-shrink-0',
              viewStatus === 'unwatched' && 'stroke-muted-foreground/50',
              iconStyle,
            )}
          />
        )}
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div>
            {viewStatus === 'unwatched'
              ? 'Вы не отслеживаете это дело'
              : props.row.original?.lastSeen
                ? 'Вы видели это дело ' +
                  format(props.row.original?.lastSeen, 'dd.MM.yyyy HH:mm')
                : 'Вы еще не видели это дело'}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { ViewStatusCell };
