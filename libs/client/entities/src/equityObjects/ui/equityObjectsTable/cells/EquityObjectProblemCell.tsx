import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { format, isAfter } from 'date-fns';
import { CaseClasses, CaseFull, EquityObject } from '@urgp/shared/entities';
import {
  equityObjectStatusStyles,
  equityObjectTypeStyles,
} from '../../../../equityClassificators';
import { EquityObjectProblemList } from '../../EquityObjectProblemList';
// import { equityBuildingStyles } from 'libs/client/entities/src/equityClassificators';

function EquityObjectProblemCell(
  props: CellContext<EquityObject, string>,
): JSX.Element {
  const rowData = props.row?.original;

  return (
    <div className="w-full flex-wrap overflow-hidden">
      <EquityObjectProblemList problems={rowData.problems} variant="compact" />
    </div>
  );
}

export { EquityObjectProblemCell };
