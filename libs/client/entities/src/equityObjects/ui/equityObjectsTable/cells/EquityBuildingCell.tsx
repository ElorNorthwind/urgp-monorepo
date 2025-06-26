import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { EquityObject } from '@urgp/shared/entities';
import { equityBuildingStyles } from '../../../../equityClassificators';

function EquityBuildingCell(
  props: CellContext<EquityObject, string>,
): JSX.Element {
  const rowData = props.row?.original;

  const styleCode =
    (rowData.building?.developerShort === 'МОС1' ? 'ao' : 'fond') +
    (rowData.building?.isDone ? '_done' : '_construction');
  const { icon: BuildingIcon, iconStyle } =
    equityBuildingStyles?.[styleCode] || Object.values(equityBuildingStyles)[0];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-row gap-2 truncate">
          {BuildingIcon && (
            <BuildingIcon className={cn('size-8 flex-shrink-0', iconStyle)} />
          )}
          <div className="flex flex-1 flex-col items-start justify-start truncate">
            <div className="truncate">
              <span className="">{rowData?.building?.addressShort}</span>
            </div>
            <div
              className={cn(
                'text-muted-foreground w-full truncate text-xs',
                'first:[&>*]:mr-1 first:[&>*]:border-r first:[&>*]:pr-1',
              )}
            >
              <span className="w-full truncate font-light">
                {'ЖК ' + rowData?.building?.complexName || '-'}
              </span>
              <span className="w-full truncate font-thin">
                {rowData?.building?.developerShort}
              </span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[500px] flex-col gap-0">
            <div className="font-bold">
              {rowData?.building?.addressFull || '-'}
            </div>
            <div className="flex items-start justify-between">
              <span>Кад.№:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.building?.cadNum || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>UNOM:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.building?.unom || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Застройщик:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.building?.developer || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>ЖК:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.building?.complexName || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Адрес стр.:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.building?.addressConstruction || '-'}
              </span>
            </div>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { EquityBuildingCell };
