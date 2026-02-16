import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import { SimpleBarChart } from '@urgp/client/features';
import {
  cn,
  ProgressCircle,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { VksUserStats } from '@urgp/shared/entities';

function VksUserWorkloadCell(
  props: CellContext<VksUserStats, number>,
): JSX.Element {
  const rowData = props.row?.original;
  const maxValue = props.column.getFacetedMinMaxValues()?.[1] ?? 0;
  const percent =
    maxValue > 0 && props.getValue() > 0
      ? Math.round((props.getValue() / maxValue) * 100)
      : 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row items-center gap-2">
          <div className="w-7 flex-grow-0 text-right text-lg">
            {new Intl.NumberFormat('Ru-ru').format(rowData?.total)}
          </div>
          <div className="bg-muted-foreground/5 relative h-5 max-w-12 flex-grow rounded">
            <div
              className="legt-0 bg-muted-foreground/20 absolute top-0 h-5 rounded"
              style={{ width: `${percent}%` }}
            />
            <div className="text-muted-foreground bg-red-300r w-full px-2 text-right font-light">
              {Number(props.getValue() ?? 0).toFixed(2)}
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[600px] flex-col gap-0">
            <div className="flex items-start justify-between">
              <span>Проведено консультаций:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.total}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <span>Рабочих дней:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.wd}
              </span>
            </div>

            <div className="flex items-start justify-between">
              <span>Консультаций в день:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {Number(props.getValue() ?? 0).toFixed(2)}
              </span>
            </div>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { VksUserWorkloadCell };
