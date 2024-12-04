import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseWithStatus } from '@urgp/shared/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { caseStatusStyles } from '../../../config/caseStyles';

function CaseStatusCell(
  props: CellContext<CaseWithStatus, string>,
): JSX.Element {
  const status = props.row.original.status;
  const { icon: StatusIcon, iconStyle } = caseStatusStyles[status.id];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row items-center justify-start gap-2">
          {StatusIcon && <StatusIcon className={cn('size-8', iconStyle)} />}
          <div className="flex flex-1 flex-col items-start justify-start truncate">
            <div className="truncate">{status.name}</div>
            <div className="text-muted-foreground">
              <span className="">срок: 10.01.2025</span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex flex-col gap-1">
            Тут будут сроки вякие по делу...
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { CaseStatusCell };
