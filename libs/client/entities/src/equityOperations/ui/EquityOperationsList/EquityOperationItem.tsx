import { cn, Skeleton } from '@urgp/client/shared';
import { EquityOperation } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { equityOperationTypeStyles } from '../../../equityClassificators';

type EquityOperationItemProps = {
  operation?: EquityOperation | null;
  hover?: boolean;
  className?: string;
};

const EquityOperationItem = (props: EquityOperationItemProps): JSX.Element => {
  const { className, operation, hover = true } = props;

  if (!operation || operation === null) {
    return <Skeleton className="h-8 w-full" />;
  }

  const { icon: StageIcon, iconStyle } =
    equityOperationTypeStyles?.[operation?.type?.id || 0] ||
    Object.entries(equityOperationTypeStyles)[0];

  return (
    <div
      className={cn(
        'group relative flex w-full flex-col border-b p-4 last:border-b-0',
        className,
      )}
    >
      <div className="flex items-center justify-start gap-2 text-sm">
        {StageIcon && <StageIcon className={cn('-mr-1 size-4', iconStyle)} />}
        <span className={cn('truncate font-bold')}>
          {operation?.type?.name}
        </span>
        <span
          className={cn(
            'text-muted-foreground ml-auto font-semibold',
            operation?.result === 'отрицательное' && 'text-red-600',
            operation?.result === 'положительное' && 'text-green-600',
          )}
        >
          {operation?.result || ''}
        </span>
        <span className={cn('text-muted-foreground')}>
          {operation?.date ? format(operation?.date, 'dd.MM.yyyy') : 'без даты'}
        </span>
      </div>
      <div className="font-light">{operation?.notes}</div>

      {hover && (
        <div className="bg-background absolute bottom-3 right-4 hidden flex-row items-center gap-2 rounded-full p-1 text-right text-xs font-thin shadow-sm group-hover:flex">
          <span>
            {operation?.createdAt
              ? format(operation?.createdAt, 'dd.MM.yyyy')
              : 'без даты'}
          </span>
          <span className="bg-muted-foreground/5 border-x px-2 font-bold">
            {operation?.source || 'Ручной ввод'}
          </span>
          <span className="mr-1 font-normal">
            {operation?.createdBy?.fio || 'Автозагрузка'}
          </span>
        </div>
      )}
    </div>
  );
};

export { EquityOperationItem };
