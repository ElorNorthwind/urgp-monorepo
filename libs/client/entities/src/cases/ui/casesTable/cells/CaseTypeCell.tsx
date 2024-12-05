import { CellContext } from '@tanstack/react-table';
import {
  Badge,
  cn,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CasesPageSearchDto, CaseWithStatus } from '@urgp/shared/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { caseTypeStyles } from '../../../config/caseStyles';
import { getRouteApi } from '@tanstack/react-router';
import { ChevronLeft, Play, StepBack } from 'lucide-react';

function CaseTypeCell(props: CellContext<CaseWithStatus, string>): JSX.Element {
  const payload = props.row.original.payload;
  const { icon: TypeIcon, iconStyle } = caseTypeStyles[payload.type.id];
  const search = getRouteApi('/control').useSearch() as CasesPageSearchDto;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row items-center justify-start gap-2">
          {TypeIcon && <TypeIcon className={cn('size-8', iconStyle)} />}
          <div className="flex flex-1 flex-col items-start justify-start truncate">
            <div className="truncate">{payload.type.name}</div>
            <div className="text-muted-foreground line-clamp-1 flex items-start justify-center gap-1 text-xs">
              Системная прорблема ...
            </div>
          </div>
          {search.selectedCase === props.row.original.id && (
            <ChevronLeft className="text-muted-foreground absolute right-0 size-8" />
          )}
          {search.selectedCase === props.row.original.id && (
            <div className="border-muted-foreground absolute inset-0 border" />
          )}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex flex-col gap-1">Список проблем...</div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { CaseTypeCell };
