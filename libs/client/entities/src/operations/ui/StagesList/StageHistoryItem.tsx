import { cn, Skeleton } from '@urgp/client/shared';
import { ControlStagePayloadHistoryData } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Circle } from 'lucide-react';
import {
  approveStatusStyles,
  operationTypeStyles,
} from '../../config/operationStyles';

type StageHistoryItemProps = {
  item: ControlStagePayloadHistoryData | null;
  className?: string;
};

const StageHistoryItem = (props: StageHistoryItemProps): JSX.Element => {
  const { className, item } = props;

  if (item === null) {
    return <Skeleton className="h-8 w-full" />;
  }

  const { icon: StageIcon, iconStyle } = operationTypeStyles?.[
    item.type.id
  ] || {
    icon: Circle,
    iconStyle: 'text-muted-foreground/40',
  };

  const { badgeStyle, fontStyle, label } = approveStatusStyles?.[
    item.approveStatus
  ] || {
    label: 'Без статуса',
    badgeStyle: 'bg-background',
    fontStyle: '',
  };

  return (
    <div
      className={cn(
        'group relative flex w-full flex-col overflow-hidden border-b p-4 last:border-b-0',
        badgeStyle,
        className,
      )}
    >
      <div className="flex items-center justify-start gap-2 text-sm">
        {StageIcon && <StageIcon className={cn('-mr-1 size-4', iconStyle)} />}
        <span className={cn('truncate font-bold', fontStyle)}>
          {item.type.fullname}
        </span>
        <div className="text-muted-foreground ml-auto flex flex-row gap-1 text-nowrap text-xs">
          <span>{item.updatedBy.fio}</span>
          <span>{format(item.updatedAt, 'dd.MM.yyyy HH:mm')}</span>
        </div>
      </div>
      <div className="text-muted-foreground bg-muted-foreground/5 -mx-4 my-1 flex flex-row justify-start gap-1 px-4 text-sm">
        {item.doneDate && (
          <>
            <span className="">от</span>
            <span className="">{format(item.doneDate, 'dd.MM.yyyy')}</span>
          </>
        )}
        {item.num && (
          <>
            <span className="ml-auto">№</span>
            <span className="">{item.num}</span>
          </>
        )}
      </div>
      <div className="font-light">{item.description}</div>
      <div className="text-muted-foreground">
        <span className="font-medium">{label}</span>
        {item.approver?.fio && (
          <span className="text-nowrap">{': ' + item.approver?.fio}</span>
        )}
      </div>
    </div>
  );
};

export { StageHistoryItem };
