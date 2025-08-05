import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  Badge,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { VksCase } from '@urgp/shared/entities';
import { departmentStyles } from '../../../config/vksStyles';

function VksCaseConsultantCell(
  props: CellContext<VksCase, string>,
): JSX.Element {
  const rowData = props.row?.original;

  const {
    // icon: DepartmentIcon,
    // iconStyle: departmentIconStyle,
    badgeStyle: departmentBadgeStyle,
  } =
    departmentStyles?.[
      (rowData?.departmentId || 0) as keyof typeof departmentStyles
    ] || Object.values(departmentStyles)[0];

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row gap-2">
          <div className="flex w-[calc(100%-2.5rem)] flex-1 flex-shrink flex-col items-start justify-start">
            <div className="flex w-full gap-1">
              <span className="w-full truncate">{props.getValue()}</span>
            </div>
            <div className="text-muted-foreground flex w-full flex-nowrap overflow-hidden text-xs">
              <Badge
                variant={'outline'}
                className={cn(
                  departmentBadgeStyle,
                  'pointer-events-none h-5 truncate whitespace-nowrap text-nowrap px-1 font-normal',
                )}
              >
                {rowData?.departmentName}
              </Badge>
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
              <span>Подразделение:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.departmentName || '-'}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Сервис:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {rowData?.serviceName || '-'}
              </span>
            </div>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { VksCaseConsultantCell };
