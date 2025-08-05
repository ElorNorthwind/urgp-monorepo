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
import {
  clientTypeStyles,
  vksCaseStatusStyles,
} from '../../../config/vksStyles';

function VksCaseStatusCell(props: CellContext<VksCase, string>): JSX.Element {
  const rowData = props.row?.original;

  const { icon: CaseStatusIcon, iconStyle: caseStatusIconStyle } =
    vksCaseStatusStyles?.[
      (rowData?.status || 'обслужен') as keyof typeof vksCaseStatusStyles
    ] || Object.values(vksCaseStatusStyles)[0];

  return (
    <div className="flex w-full flex-row gap-2">
      {CaseStatusIcon && (
        <CaseStatusIcon
          className={cn('size-8 flex-shrink-0', caseStatusIconStyle)}
        />
      )}
      <div className="flex w-[calc(100%-2.5rem)] flex-1 flex-shrink flex-col items-start justify-start">
        <div className="flex w-full gap-1">
          <span className="w-full truncate">{props?.getValue()}</span>
        </div>
        <div
          className={cn(
            'text-muted-foreground w-[calc(100%-2.5rem)] truncate text-xs',
            rowData?.hasTechnicalProblems && 'text-red-500',
          )}
        >
          <span className={cn('w-full font-thin')}>
            {rowData?.hasTechnicalProblems
              ? 'Технические проблемы'
              : 'Без тех. проблем'}
          </span>
        </div>
      </div>
    </div>
  );
}

export { VksCaseStatusCell };
