import { CellContext } from '@tanstack/react-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CaseDirectionsList } from '../../CaseDirectionsList';

function DirectionCell(props: CellContext<Case, string>): JSX.Element {
  const payload = props.row.original.payload;
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
