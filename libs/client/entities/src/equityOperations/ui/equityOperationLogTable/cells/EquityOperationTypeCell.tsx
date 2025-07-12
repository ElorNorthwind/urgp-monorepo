import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { EquityOperationLogItem } from '@urgp/shared/entities';
import { format, isAfter } from 'date-fns';
import { equityOperationTypeStyles } from '../../../../equityClassificators';
// import { equityBuildingStyles } from 'libs/client/entities/src/equityClassificators';

function EquityOperationTypeCell(
  props: CellContext<EquityOperationLogItem, number>,
): JSX.Element {
  const rowData = props.row?.original;

  const { icon: TypeIcon, iconStyle } =
    equityOperationTypeStyles?.[rowData.operation?.type?.id || 0] ||
    Object.values(equityOperationTypeStyles)[0];

  const dateStr = rowData?.operation?.date
    ? format(rowData?.operation?.date, 'dd.MM.yyyy')
    : rowData?.operation?.createdAt
      ? format(rowData?.operation?.createdAt, 'dd.MM.yyyy')
      : '-';

  const resultOrNumberStr = rowData?.operation?.type?.fields?.includes('result')
    ? rowData?.operation?.result
    : rowData?.operation?.number;

  // const { label } =
  //   equityObjectTypeStyles?.[rowData.objectTypeId || 0] ||
  //   Object.values(equityObjectTypeStyles)[0];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row gap-2">
          {TypeIcon && (
            <TypeIcon className={cn('size-8 flex-shrink-0', iconStyle)} />
          )}
          <div className="flex flex-1 flex-col items-start justify-start truncate">
            <div className="truncate">
              <span className="text-bold">
                {rowData?.operation?.type?.name}
              </span>
            </div>
            <div className="text-muted-foreground w-full truncate text-xs">
              {resultOrNumberStr && (
                <span className="w-full truncate font-thin">
                  {resultOrNumberStr || '-'}
                </span>
              )}
              <span
                className={cn(
                  'w-full truncate font-thin',
                  resultOrNumberStr && 'ml-1 border-l pl-1',
                )}
              >
                {dateStr}
              </span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[450px] flex-col gap-0">
            <div className="font-bold">
              {rowData?.operation?.type?.name || '-'}
            </div>
            <div className="flex items-start justify-between">
              <span>Дата:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {dateStr}
              </span>
            </div>
            {rowData?.operation?.type?.fields?.includes('result') &&
              rowData?.operation?.result && (
                <div className="flex items-start justify-between">
                  <span>Результат:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {rowData?.operation?.result}
                  </span>
                </div>
              )}
            <div className="border-muted-foreground/10 mt-1 flex items-start justify-between border-t border-dashed pt-1">
              {/* <span>Примечания:</span> */}
              <span className="text-muted-foreground ml-2 line-clamp-3 font-normal">
                {rowData?.operation?.notes || '-'}
              </span>
            </div>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { EquityOperationTypeCell };
