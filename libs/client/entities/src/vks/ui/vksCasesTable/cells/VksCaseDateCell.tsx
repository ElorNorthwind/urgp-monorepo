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
  VksCase,
  VksCasesPageSearch,
} from '@urgp/shared/entities';
import {
  equityObjectStatusStyles,
  equityObjectTypeStyles,
} from '../../../../equityClassificators';
import { getRouteApi, useLocation } from '@tanstack/react-router';
import { ChevronLeft } from 'lucide-react';
// import { equityBuildingStyles } from 'libs/client/entities/src/equityClassificators';

function VksCaseDateCell(props: CellContext<VksCase, number>): JSX.Element {
  const pathname = useLocation()?.pathname;
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;
  const rowData = props.row?.original;
  const isTransitional = [
    'отменено ОИВ',
    'отменено пользователем',
    'талон не был взят',
  ].includes(rowData?.status || '');

  // const {
  //   icon: StatusIcon,
  //   iconStyle,
  //   label: statusLabel,
  // } = equityObjectStatusStyles?.[rowData.statusId || 0] ||
  // Object.values(equityObjectStatusStyles)[0];

  // const { label } =
  //   equityObjectTypeStyles?.[rowData.objectTypeId || 0] ||
  //   Object.values(equityObjectTypeStyles)[0];

  return (
    <div className="flex w-full flex-row gap-2">
      {/* {StatusIcon && (
            <StatusIcon className={cn('size-8 flex-shrink-0', iconStyle)} />
          )} */}
      <div
        className={cn(
          'flex flex-1 flex-col items-start justify-start truncate',
          isTransitional && 'opacity-50',
        )}
      >
        <div className="flex gap-1 truncate">
          <span className="text-bold">
            {format(rowData?.date, 'dd.MM.yyyy')}
          </span>
        </div>
        <div className="text-muted-foreground w-full truncate text-xs">
          <span className="w-full truncate font-thin">
            {rowData?.time?.slice(0, 5) + '-' + rowData?.time?.slice(9, 14)}
          </span>
        </div>
      </div>
      {search?.selectedCase === props.row.original?.id && (
        <>
          <ChevronLeft className="text-muted-foreground absolute right-0 size-8" />
          <div className="border-muted-foreground pointer-events-none absolute inset-0 border" />
        </>
      )}
    </div>
  );
}

export { VksCaseDateCell };
