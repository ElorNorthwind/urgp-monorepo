import { CellContext } from '@tanstack/react-table';
import {
  Badge,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { directionCategoryStyles } from '../../../config/caseStyles';
import { CaseDirectionsList } from '../../CaseDirectionsList';

function DirectionCell(props: CellContext<Case, string>): JSX.Element {
  const payload = props.row.original.payload;
  return (
    <Tooltip>
      <TooltipTrigger>
        <CaseDirectionsList
          directions={payload.directions}
          variant="list"
          className="max-h-12 overflow-hidden"
          // className="bg-red-300"
        />
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />

          <CaseDirectionsList
            directions={payload.directions}
            variant="table"
            label="Направления работы:"
          />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { DirectionCell };
