import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { getRouteApi, useLocation } from '@tanstack/react-router';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { VksCase, VksCasesPageSearch } from '@urgp/shared/entities';
import { clientTypeStyles } from '../../../config/vksStyles';

function VksCaseClientCell(props: CellContext<VksCase, string>): JSX.Element {
  const rowData = props.row?.original;

  const { icon: ClientIcon, iconStyle: clientIconStyle } =
    clientTypeStyles?.[
      (rowData?.clientType ||
        'Физическое лицо') as keyof typeof clientTypeStyles
    ] || Object.values(clientTypeStyles)[0];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row gap-2">
          {ClientIcon && (
            <ClientIcon
              className={cn('size-8 flex-shrink-0', clientIconStyle)}
            />
          )}
          <div className="flex flex-1 flex-shrink flex-col items-start justify-start truncate">
            <div className="flex w-full gap-1">
              <span className="w-full truncate">{props.getValue()}</span>
            </div>
            <div className="text-muted-foreground flex w-full flex-nowrap overflow-hidden text-xs">
              <span className="flex-shrink-0 truncate font-thin">
                {rowData?.bookingCode}
              </span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[500px] flex-col gap-0">
            <div className="font-bold">{props?.getValue() || '-'}</div>
            <div className="flex items-start justify-between">
              <span>Тип заявителя:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.clientType || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Источник записи:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.bookingSource || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Код бронирования:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.bookingCode || '-'}
              </span>
            </div>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { VksCaseClientCell };
