import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  getApproveInfo,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { format, isBefore, isEqual, startOfToday } from 'date-fns';
import { Circle } from 'lucide-react';
import { caseStatusStyles, viewStatusStyles } from '../../../config/caseStyles';
import { CaseDispatchesList } from '../../CaseDispatchesList';
import { CaseFull } from '@urgp/shared/entities';
import { start } from 'repl';

function CaseStatusCell(props: CellContext<CaseFull, string>): JSX.Element {
  const status = props.row.original?.status;
  const dispatches = props.row.original?.dispatches || [];
  const approveStatus = props.row.original?.approveStatus || 'approved';
  const { icon: StatusIcon, iconStyle } =
    caseStatusStyles?.[status?.id] ?? Object.values(caseStatusStyles)[0];

  const { badgeStyle: viewStatusIconStyle } = viewStatusStyles?.[
    props.row.original?.viewStatus
  ] || {
    icon: null,
    iconStyle: '',
    badgeStyle: 'hidden',
  };

  const caseApproveInfo = getApproveInfo(props.row.original);

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="relative flex w-full flex-row items-center justify-start gap-2">
          {StatusIcon && (
            <StatusIcon className={cn('size-8 flex-shrink-0', iconStyle)} />
          )}
          {/* {StatusIcon && <StatusIcon className={cn('size-8', iconStyle)} />} */}
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
              {status?.category !== 'рассмотрено' &&
              approveStatus !== 'approved' ? (
                caseApproveInfo?.currentFio
              ) : dispatches?.length > 0 && dispatches?.[0]?.dueDate ? (
                status?.category !== 'рассмотрено' ? (
                  <span
                    className={cn(
                      isBefore(dispatches[0].dueDate, startOfToday())
                        ? 'text-rose-700/80'
                        : isEqual(dispatches[0].dueDate, startOfToday())
                          ? 'text-orange-700/80'
                          : '',
                    )}
                  >
                    {'срок: ' + format(dispatches[0].dueDate, 'dd.MM.yyyy')}
                  </span>
                ) : (
                  <span>срок снят</span>
                )
              ) : (
                <span>нет поручений</span>
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
