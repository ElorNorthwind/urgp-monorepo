import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { format, isAfter } from 'date-fns';
import {
  CaseClasses,
  CaseFull,
  EquityObject,
  EquityOperationLogItem,
} from '@urgp/shared/entities';
import {
  equityObjectStatusStyles,
  equityObjectTypeStyles,
} from '../../../../equityClassificators';
// import { equityBuildingStyles } from 'libs/client/entities/src/equityClassificators';

function EquityObjectStatusCell(
  props: CellContext<EquityOperationLogItem, number>,
): JSX.Element {
  const rowData = props.row?.original;

  const {
    icon: StatusIcon,
    iconStyle,
    label: statusLabel,
  } = equityObjectStatusStyles?.[rowData.statusId || 0] ||
  Object.values(equityObjectStatusStyles)[0];

  const { label } =
    equityObjectTypeStyles?.[rowData.objectTypeId || 0] ||
    Object.values(equityObjectTypeStyles)[0];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row gap-2">
          {StatusIcon && (
            <StatusIcon className={cn('size-8 flex-shrink-0', iconStyle)} />
          )}
          <div className="flex flex-1 flex-col items-start justify-start truncate">
            <div className="truncate">
              <span className="text-bold">{rowData?.statusName}</span>
            </div>
            <div className="text-muted-foreground w-full truncate text-xs">
              <span className="w-full truncate font-thin">
                {rowData?.lastOpTypeName || '-'}
              </span>
              {rowData?.lastOpDate &&
                isAfter(rowData?.lastOpDate, new Date(2000, 1, 1)) && (
                  <span className="ml-1 w-full truncate border-l pl-1 font-thin">
                    {format(rowData?.lastOpDate, 'dd.MM.yyyy')}
                  </span>
                )}
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[450px] flex-col gap-0">
            <div className="font-bold">
              {(rowData?.addressShort || '-') +
                ' ' +
                label +
                ' ' +
                rowData?.num}
            </div>
            <div className="flex items-start justify-between">
              <span>Статус:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.statusName}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Собственность:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.egrnStatus || '-'}
              </span>
            </div>
            {rowData?.lastOpTypeName && (
              <div className="flex items-start justify-between">
                <span>Последнее действие:</span>
                <span className="text-muted-foreground ml-2 font-normal">
                  {rowData?.lastOpTypeName}
                </span>
              </div>
            )}
            {rowData?.lastOpDate &&
              isAfter(rowData?.lastOpDate, new Date(2000, 1, 1)) && (
                <div className="flex items-start justify-between">
                  <span>Дата последнего действи:</span>
                  <span className="text-muted-foreground ml-2 font-normal">
                    {format(rowData?.lastOpDate, 'dd.MM.yyyy')}
                  </span>
                </div>
              )}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { EquityObjectStatusCell };
