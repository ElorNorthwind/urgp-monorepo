import { CellContext } from '@tanstack/react-table';
import { cn } from '@urgp/client/shared';
import { CaseFull } from '@urgp/shared/entities';
import { format } from 'date-fns';
import {
  approveStatusStyles,
  operationTypeStyles,
} from '../../../../operations/config/operationStyles';
import { caseTypeStyles } from '../../../config/caseStyles';

function PendingOperationCell(
  props: CellContext<CaseFull, string>,
): JSX.Element | null {
  const stage = props.row.original?.myPendingStage;

  if (!stage) return null;

  const { icon: StageIcon, iconStyle } =
    operationTypeStyles?.[stage?.type.id] ||
    Object.values(operationTypeStyles)[0];

  const { bgStyle, fontStyle, badgeStyle, label } =
    approveStatusStyles?.[stage?.approveStatus] ||
    Object.values(approveStatusStyles)[0];

  const { icon: TypeIcon, iconStyle: typeIconStyle } =
    caseTypeStyles?.[props.row.original?.type?.id] ||
    Object.values(caseTypeStyles)[0];

  if (props.row.original?.actions.includes('case-rejected'))
    //TODO: Кнопка с эскалацией или продлением срока
    return (
      <div className="gap-1 font-semibold leading-tight text-amber-500">
        Проект дела не утвержден
      </div>
    );

  if (props.row.original?.actions.includes('reminder-overdue')) {
    return (
      <div className="gap-1 font-semibold leading-tight text-rose-400">
        Не решено в ожидавшийся срок
      </div>
    );
  }

  if (props.row.original?.actions.includes('reminder-done')) {
    return (
      <div className="gap-1 font-semibold leading-tight text-emerald-400">
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
          {stage?.doneDate ? format(stage.doneDate, 'dd.MM.yyyy') : ''}
        </span>
        <span className={cn('text-muted-foreground flex-shrink truncate')}>
          {stage?.title ? '№ ' + stage.title : ''}
        </span>
        <span
          className={cn('text-muted-foreground ml-auto flex-shrink-0')}
        >{`[${stage?.author?.fio}]`}</span>
      </div>
      <div className="flex flex-row items-center gap-1">
        {StageIcon && (
          <StageIcon className={cn('size-4 flex-shrink-0', iconStyle)} />
        )}
        <span className={cn('truncate text-sm font-bold', fontStyle)}>
          {stage?.type?.fullname}
        </span>
      </div>
      <div className={cn('truncate')}>{stage?.notes || ''}</div>

      {/* <StageItem stage={pengingStage} hover={false} />; */}
    </div>
  );
}

export { PendingOperationCell };
