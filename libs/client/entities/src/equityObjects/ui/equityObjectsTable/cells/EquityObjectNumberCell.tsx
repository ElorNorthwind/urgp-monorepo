import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { format } from 'date-fns';
import { CaseClasses, CaseFull, EquityObject } from '@urgp/shared/entities';
import { equityObjectTypeStyles } from '../../../../equityClassificators';
// import { equityBuildingStyles } from 'libs/client/entities/src/equityClassificators';

function EquityObjectNumberCell(
  props: CellContext<EquityObject, number>,
): JSX.Element {
  const rowData = props.row?.original;

  const {
    icon: TypeIcon,
    iconStyle,
    label,
  } = equityObjectTypeStyles?.[rowData.objectTypeId || 0] ||
  Object.values(equityObjectTypeStyles)[0];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row gap-2 truncate">
          {TypeIcon && (
            <TypeIcon className={cn('size-8 flex-shrink-0', iconStyle)} />
          )}
          <div className="flex flex-1 flex-col items-start justify-start truncate">
            <div className="truncate">
              <span className="text-bold">{label + ' ' + rowData?.num}</span>
              {rowData?.floor && (
                <span className="ml-1 w-full truncate border-l pl-1 font-thin">
                  {rowData?.floor + ' этаж'}
                </span>
              )}
              {rowData?.rooms && (
                <span className="ml-1 w-full truncate border-l pl-1 font-thin">
                  {rowData?.rooms + ' комн.'}
                </span>
              )}
              {rowData?.s && (
                <span className="ml-1 w-full truncate border-l pl-1 font-thin">
                  {rowData?.s + ' м²'}
                </span>
              )}
            </div>
            <div className="text-muted-foreground w-full truncate text-xs">
              <span className="w-full truncate font-thin">
                {rowData?.cadNum}
              </span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[300px] flex-col gap-0">
            <div className="font-bold">
              {(rowData?.addressShort || '-') +
                ' ' +
                label +
                ' ' +
                rowData?.num}
            </div>
            <div className="flex items-start justify-between">
              <span>Кад.№:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.cadNum || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>UNKV:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.unkv || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Этаж:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.floor || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Площадь:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.s || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Комнат:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.rooms || '-'}
              </span>
            </div>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { EquityObjectNumberCell };
