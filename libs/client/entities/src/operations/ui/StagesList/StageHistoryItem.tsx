import { cn, Skeleton } from '@urgp/client/shared';
import { format } from 'date-fns';
import { Circle } from 'lucide-react';
import {
  approveStatusStyles,
  operationTypeStyles,
} from '../../config/operationStyles';
import { OperationFull } from '@urgp/shared/entities';

type StageHistoryItemProps = {
  item: OperationFull | null;
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

  const { bgStyle, badgeStyle, fontStyle, label } = approveStatusStyles?.[
    item.approveStatus
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
        'group relative flex w-full flex-col overflow-hidden border-b p-4 last:border-b-0',
        bgStyle,
        className,
      )}
    >
      <div className="flex items-center justify-start gap-2 text-sm">
        {StageIcon && <StageIcon className={cn('-mr-1 size-4', iconStyle)} />}
        <span className={cn('truncate font-bold', fontStyle)}>
          {item.type.fullname}
        </span>
        <div className="text-muted-foreground ml-auto flex flex-row gap-1 whitespace-nowrap text-nowrap text-xs">
          <span>{item?.updatedBy?.fio || item?.author?.fio || '-'}</span>
          <span>
            {format(item?.updatedAt || item?.createdAt, 'dd.MM.yyyy HH:mm')}
          </span>
        </div>
      </div>
      <div className="text-muted-foreground bg-muted-foreground/5 -mx-4 my-1 flex flex-row justify-start gap-1 px-4 text-sm">
        {item.doneDate && (
          <>
            <span className="">от</span>
            <span className="">{format(item.doneDate, 'dd.MM.yyyy')}</span>
          </>
        )}
        {item.title && (
          <>
            <span className="ml-auto">№</span>
            <span className="">{item.title}</span>
          </>
        )}
      </div>
      <div className="font-light">{item?.notes}</div>

      <div
        className={cn(
          'mt-2 grid grid-cols-[auto_auto_1fr] border-l-4 px-2 py-1',
          badgeStyle,
        )}
      >
        <span className="font-medium">{label}</span>
        {item?.approveTo?.fio && (
          <span className="whitespace-nowrap text-nowrap">
            {': ' + item?.approveTo?.fio}
          </span>
        )}
        {item?.approveDate && (
          <span className="ml-auto whitespace-nowrap text-nowrap">
            {format(item.approveDate, 'dd.MM.yyyy HH:mm')}
          </span>
        )}
        {item?.approveNotes && (
          <span className="col-span-3 italic">{item.approveNotes}</span>
        )}
      </div>
    </div>
  );
};

export { StageHistoryItem };
