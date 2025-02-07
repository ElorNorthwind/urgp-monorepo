import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@urgp/client/shared';
import { CaseFull } from '@urgp/shared/entities';
import { CaseDirectionsList } from '../../CaseDirectionsList';

function DirectionCell(props: CellContext<CaseFull, string>): JSX.Element {
  const payload = props.row.original;
  return (
    <Tooltip>
      <TooltipTrigger className="flex-wrap overflow-hidden">
        <CaseDirectionsList
          directions={payload?.directions}
          variant="compact"
          className="max-h-14 overflow-hidden"
          // className="bg-red-300"
        />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom" className="p-3">
          <TooltipArrow />
          <CaseDirectionsList
            directions={payload?.directions}
            variant="table"
            label="Направления работы:"
          />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { DirectionCell };
