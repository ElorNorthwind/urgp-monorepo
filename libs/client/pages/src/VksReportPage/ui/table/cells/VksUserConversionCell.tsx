import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Progress,
  ProgressCircle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { VksUserStats } from '@urgp/shared/entities';

import { Star } from 'lucide-react';

function VksUserConversionCell(
  props: CellContext<VksUserStats, number>,
): JSX.Element {
  // const rowData = props.row?.original;

  const value = (props.getValue() ?? 0) * 100;
  const roundedValue = Math.round(value) ?? 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row justify-center">
          <ProgressCircle
            value={roundedValue}
            units="%"
            variant="gauge"
            className="-m-2 text-blue-600"
          />
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[500px] flex-col gap-0">
            <div className="flex items-start justify-between">
              <span>Доля оцененных консультаций:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {Math.round(props.getValue() * 10000) / 100}%
              </span>
            </div>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { VksUserConversionCell };
