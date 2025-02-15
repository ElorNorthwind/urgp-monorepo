import { CellContext } from '@tanstack/react-table';
import { CaseFull } from '@urgp/shared/entities';
import {
  approveStatusStyles,
  operationTypeStyles,
} from '../../../../operations/config/operationStyles';
import { StageItem } from '../../../../operations';
import { cn } from '@urgp/client/shared';
import { format } from 'date-fns';
import { ClipboardPen } from 'lucide-react';

function RelevantStageCell(
  props: CellContext<CaseFull, string>,
): JSX.Element | null {
  const stage =
    props.row.original?.myPendingStage || props.row.original?.lastStage;
  const mode = props.row.original?.myPendingStage !== null ? 'pending' : 'last';

  if (!stage)
    return (
      <div className="text-muted-foreground w-full">
        Работа еще не проводилась...
      </div>
    );

  const { icon: StageIcon, iconStyle } =
    operationTypeStyles?.[stage.type.id] ||
    Object.values(operationTypeStyles)[0];

  return (
    <div
      className={cn(
        'relative w-full',
        mode === 'pending' && 'bg-muted-foreground/5 -m-2 rounded p-2',
        // 'from-muted-foreground/5 background to-muted-foreground/10 -m-2 rounded bg-gradient-to-bl p-2',
      )}
    >
      <div className="tuncate flex w-full flex-row items-center justify-between gap-2 text-xs">
        {mode === 'pending' ? (
          <>
            <ClipboardPen className="text-sidebar-border absolute -top-2 right-1 -z-10 size-8" />
            <div className="text-muted-foreground/80 truncate">
              Ожидает Вашего решения
            </div>
          </>
        ) : (
          <>
            <span
              className={cn('text-muted-foreground flex-shrink-0 truncate')}
            >
              {stage?.doneDate ? format(stage.doneDate, 'dd.MM.yyyy') : ''}
            </span>
            <span className={cn('text-muted-foreground flex-shrink truncate')}>
              {stage?.title ? '№ ' + stage.title : ''}
            </span>
            <span
              className={cn(
                'text-muted-foreground ml-auto flex-shrink truncate',
              )}
            >{`[${stage?.author?.fio}]`}</span>
          </>
        )}
      </div>
      <div className={cn('flex flex-row items-center gap-1')}>
        {StageIcon && (
          <StageIcon className={cn('size-4 flex-shrink-0', iconStyle)} />
        )}
        <span className={cn('truncate text-sm font-bold')}>
          {stage?.type?.fullname}
        </span>
      </div>
      <div className={cn('truncate')}>{stage?.notes || ''}</div>

      {/* <StageItem stage={pengingStage} hover={false} />; */}
    </div>
  );
}

export { RelevantStageCell };
