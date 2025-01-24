import { CellContext } from '@tanstack/react-table';
import { cn } from '@urgp/client/shared';
import { CaseWithPendingInfo, ControlStage } from '@urgp/shared/entities';
import { format } from 'date-fns';
import {
  approveStatusStyles,
  operationTypeStyles,
} from '../../../../operations/config/operationStyles';
import { caseTypeStyles } from '../../../config/caseStyles';

function PendingOperationCell(
  props: CellContext<CaseWithPendingInfo, Date>,
): JSX.Element {
  const stage = props.row.original?.pendingStage as ControlStage;

  const { icon: StageIcon, iconStyle } =
    operationTypeStyles?.[stage?.payload.type.id] ||
    Object.values(operationTypeStyles)[0];

  const { bgStyle, fontStyle, badgeStyle, label } =
    approveStatusStyles?.[stage?.payload.approveStatus] ||
    Object.values(approveStatusStyles)[0];

  const { icon: TypeIcon, iconStyle: typeIconStyle } =
    caseTypeStyles?.[props.row.original?.payload?.type?.id] ||
    Object.values(caseTypeStyles)[0];

  if (props.row.original?.action === 'done-reminder') {
    return (
      <div className="text-muted-foreground/50 gap-1 font-semibold leading-tight">
        Исполнитель принял решение
      </div>
    );
  }

  if (!stage) {
    return (
      <div className="text-muted-foreground/50 gap-1 font-semibold leading-tight">
        Проект дела на утверждение
      </div>
    );
  }

  return (
    <div className="w-full">
      <div className="tuncate flex flex-row items-center justify-start gap-2 text-xs">
        <span className={cn('text-muted-foreground flex-shrink-0')}>
          {format(stage.payload.doneDate, 'dd.MM.yyyy')}
        </span>
        <span className={cn('text-muted-foreground flex-shrink truncate')}>
          {stage.payload?.num ? '№ ' + stage.payload.num : ''}
        </span>
        <span
          className={cn('text-muted-foreground ml-auto flex-shrink-0')}
        >{`[${stage.author?.fio}]`}</span>
      </div>
      <div className="flex flex-row items-center gap-1">
        {StageIcon && (
          <StageIcon className={cn('size-4 flex-shrink-0', iconStyle)} />
        )}
        <span className={cn('truncate text-sm font-bold', fontStyle)}>
          {stage.payload.type.fullname}
        </span>
      </div>
      <div className={cn('truncate')}>{stage.payload?.description || ''}</div>

      {/* <StageItem stage={pengingStage} hover={false} />; */}
    </div>
  );
}

export { PendingOperationCell };
