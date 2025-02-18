import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { MessageSquare } from 'lucide-react';
import { caseTypeStyles } from '../../../config/caseStyles';
import { CaseFull } from '@urgp/shared/entities';

function CaseTypeCell(props: CellContext<CaseFull, string>): JSX.Element {
  const payload = props.row.original;
  const { icon: TypeIcon, iconStyle } =
    caseTypeStyles?.[payload?.type?.id] || Object.entries(caseTypeStyles)[0];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row items-center justify-start gap-2">
          {TypeIcon && <TypeIcon className={cn('size-8', iconStyle)} />}
          <div className="flex flex-1 flex-col items-start justify-start truncate">
            <div className="truncate">{payload?.type?.name || ''}</div>
            <div className="text-muted-foreground line-clamp-1 flex items-start justify-center gap-1 text-xs">
              {payload?.connectionsTo && payload?.connectionsTo?.length > 0 ? (
                payload?.connectionsTo.map((c) => (
                  <span key={c.id} className="rounded-full border px-2">
                    {c.title}
                  </span>
                ))
              ) : (
                <span>нет системных проблем</span>
              )}
            </div>
          </div>
          {/* {search?.selectedCase === props.row.original?.id && (
            <ChevronLeft className="text-muted-foreground absolute right-0 size-8" />
          )}
          {search?.selectedCase === props.row.original?.id && (
            <div className="border-muted-foreground pointer-events-none absolute inset-0 border" />
          )} */}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex flex-col gap-1">
            {payload?.connectionsTo && payload?.connectionsTo?.length > 0 ? (
              payload?.connectionsTo.map((c) => (
                <span key={c.id} className="rounded-full border px-2">
                  {c.title}
                </span>
              ))
            ) : (
              <span>нет системных проблем</span>
            )}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { CaseTypeCell };
