import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  getApproveInfo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseOrPending } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Circle } from 'lucide-react';
import { caseStatusStyles, viewStatusStyles } from '../../../config/caseStyles';
import { CaseDispatchesList } from '../../CaseDispatchesList';

function CaseStatusCell(
  props: CellContext<CaseOrPending, string>,
): JSX.Element {
  const status = props.row.original?.status;
  const dispatches = props.row.original?.dispatches || [];
  const approveStatus =
    props.row.original?.payload?.approveStatus || 'approved';
  const approverFio = props.row.original?.payload?.approver?.fio || '-';
  const approveByFio = props.row.original?.payload?.approveBy?.fio || '-';
  const { icon: StatusIcon, iconStyle } = caseStatusStyles?.[
    status?.id || 0
  ] || {
    icon: Circle,
    iconStyle: 'text-slate-500',
  };

  const { badgeStyle: viewStatusIconStyle } = viewStatusStyles?.[
    props.row.original?.viewStatus
  ] || {
    icon: null,
    iconStyle: '',
    badgeStyle: 'hidden',
  };

  const caseApproveInfo = getApproveInfo(props.row.original?.payload);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative flex w-full flex-row items-center justify-start gap-2">
          {StatusIcon && <StatusIcon className={cn('size-8', iconStyle)} />}
          {
            <div
              className={cn(
                'border-background absolute -left-1 bottom-0 size-4 rounded-full border-2',
                viewStatusIconStyle,
              )}
            />
          }
          <div className="flex flex-1 flex-col items-start justify-start truncate">
            <div className="truncate">{status?.name || ''}</div>
            <div className="text-muted-foreground">
              {status?.category !== 'рассмотрено' && (
                <span className="">
                  {approveStatus !== 'approved'
                    ? caseApproveInfo?.currentFio
                    : dispatches?.length > 0
                      ? 'срок: ' +
                        format(dispatches?.[0]?.dueDate, 'dd.MM.yyyy')
                      : 'нет поручений'}
                </span>
              )}
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <CaseDispatchesList
            dispatches={dispatches}
            label="Поручения:"
            compact
          />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { CaseStatusCell };
