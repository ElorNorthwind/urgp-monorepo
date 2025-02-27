import { cn, Skeleton } from '@urgp/client/shared';
import { ApproveButton } from '@urgp/client/widgets';
import { ApproveStatus, OperationFull } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Circle } from 'lucide-react';
import {
  approveStatusStyles,
  operationTypeStyles,
} from '../../config/operationStyles';
import { DeleteStageButton } from '../StageButtons/DeleteStageButton';
import { EditStageButton } from '../StageButtons/EditStageButton';
import { StagesHistory } from '../StageHistory';

type StageItemProps = {
  stage?: OperationFull | null;
  hover?: boolean;
  className?: string;
  isInvalidated?: boolean;
  showApproveInfo?: boolean;
};

const StageItem = (props: StageItemProps): JSX.Element => {
  const {
    className,
    stage,
    hover = true,
    isInvalidated = false,
    showApproveInfo = false,
  } = props;

  if (!stage || stage === null) {
    return <Skeleton className="h-8 w-full" />;
  }

  const { icon: StageIcon, iconStyle } = operationTypeStyles?.[
    stage?.type?.id
  ] || {
    icon: Circle,
    iconStyle: 'text-muted-foreground/40',
  };

  const { bgStyle, fontStyle, badgeStyle, label } = approveStatusStyles?.[
    stage?.approveStatus
  ] || {
    label: 'Без статуса',
    bgStyle: 'bg-background',
    badgeStyle:
      'border-muted-foreground/50 bg-muted-foreground/5 text-muted-foreground',
    fontStyle: '',
  };

  return (
    <div
      className={cn(
        'group relative flex w-full flex-col border-b p-4 last:border-b-0',
        bgStyle,
        isInvalidated && 'opacity-60',
        className,
      )}
    >
      <div className="flex items-center justify-start gap-2 text-sm">
        {StageIcon && <StageIcon className={cn('-mr-1 size-4', iconStyle)} />}
        <span className={cn('truncate font-bold', fontStyle)}>
          {stage?.type?.fullname}
        </span>
        <span className="ml-auto font-light">{stage?.title}</span>
        <span className={cn('text-muted-foreground')}>
          {stage?.doneDate && format(stage?.doneDate, 'dd.MM.yyyy')}
        </span>
      </div>
      <div className="font-light">{stage?.notes}</div>

      <div
        className={cn(
          'mt-2 flex flex-col gap-1 border-l-4 px-2 py-1',
          badgeStyle,
          showApproveInfo === false && 'hidden',
          // stage?.approveStatus === ApproveStatus.approved && 'hidden',
        )}
      >
        {stage?.approveTo?.fio && (
          <div className="flex flex-row gap-2">
            <span className="font-medium">{label + ': '}</span>
            <span className={cn('text-nowrap')}>
              {stage?.approveStatus === ApproveStatus.rejected
                ? stage?.approveFrom?.fio
                : stage?.approveTo?.fio}
            </span>
            {stage?.approveDate && (
              <span className="ml-auto text-nowrap">
                {format(stage?.approveDate, 'dd.MM.yyyy HH:mm')}
              </span>
            )}
          </div>
        )}

        {stage?.approveFrom?.fio &&
          stage?.approveFrom?.id !== stage?.approveTo?.id &&
          stage?.approveStatus !== ApproveStatus.approved && (
            <div className="flex flex-row gap-2">
              <span className="font-medium">Направил:</span>
              <span className="col-span-2">{stage?.approveFrom?.fio}</span>
            </div>
          )}
        <div className="flex flex-row gap-2">
          {stage?.approveNotes && (
            <span className="col-span-3 italic">{stage?.approveNotes}</span>
          )}
        </div>
      </div>

      {hover && (
        <div className="bg-background absolute bottom-3 right-4 hidden flex-row items-center gap-2 rounded-full p-1 text-right text-xs font-thin shadow-sm group-hover:flex">
          <DeleteStageButton stage={stage} />
          <ApproveButton entity={stage} variant="mini" />
          <EditStageButton stage={stage} />
          <span>
            {stage?.updatedAt && format(stage?.updatedAt || 0, 'dd.MM.yyyy')}
          </span>
          {stage?.revision > 1 && <StagesHistory stageId={stage.id} />}
          <span className="mr-1 font-normal">{stage?.author?.fio}</span>
        </div>
      )}
    </div>
  );
};

export { StageItem };
