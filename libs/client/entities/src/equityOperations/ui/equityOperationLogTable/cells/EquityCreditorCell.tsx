import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import { Tooltip, TooltipContent, TooltipTrigger } from '@urgp/client/shared';
import { EquityObject, EquityOperationLogItem } from '@urgp/shared/entities';
// import { equityBuildingStyles } from 'libs/client/entities/src/equityClassificators';

function EquityCreditorCell(
  props: CellContext<EquityOperationLogItem, string>,
): JSX.Element {
  const rowData = props.row?.original;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row gap-2">
          <div className="flex flex-1 flex-col items-start justify-start">
            <span className="text-bold line-clamp-3 leading-tight">
              {rowData?.operation?.type?.fields?.includes('fio') &&
              rowData?.operation?.fio &&
              rowData?.operation?.fio?.length > 2
                ? (rowData?.operation?.fio ?? rowData?.creditor)
                : rowData?.creditor}
            </span>
            {/* <div className="text-muted-foreground w-full truncate text-xs">
              <span className="w-full truncate font-thin">
                {rowData?.claimsCount || '-'}
              </span>
            </div> */}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[450px] flex-col gap-0">
            <div className="font-bold">{rowData.creditor}</div>
            <div className="flex items-start justify-between">
              <span>Действующие требования:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.claimsCount}
              </span>
            </div>
            {/* <div className="flex items-start justify-between">
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.identificationNotes}
              </span>
            </div> */}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { EquityCreditorCell };
