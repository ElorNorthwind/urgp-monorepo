import {
  cn,
  EQUITY_SIDEBAR_WIDTH,
  Skeleton,
  useIsMobile,
} from '@urgp/client/shared';
import { EquityOperation } from '@urgp/shared/entities';
import { format, isAfter } from 'date-fns';
import { equityOperationTypeStyles } from '../../../equityClassificators';
import { DeleteEquityOperationButton } from '../operationButtons/DeleteEquityOperationButton';
import { EditEquityOperationButton } from '../operationButtons/EditEquityOperationButton';

type EquityOperationItemProps = {
  operation?: EquityOperation | null;
  hover?: boolean;
  className?: string;
};

const EquityOperationItem = (props: EquityOperationItemProps): JSX.Element => {
  const { className, operation, hover = true } = props;
  const isMobile = useIsMobile();

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
      style={{
        maxWidth:
          'calc(' + (isMobile ? '100%' : EQUITY_SIDEBAR_WIDTH) + ' - 2.2rem)',
      }}
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
            operation?.result === 'пакет с замечаниями' && 'text-amber-600',
            operation?.result === 'условно-положительное' && 'text-amber-600',
            operation?.result === 'положительное' && 'text-green-600',
          )}
        >
          {(operation?.type?.fields?.includes('result') && operation?.result) ||
            ''}
        </span>
        <span className={cn('text-muted-foreground')}>
          {operation?.date && isAfter(operation?.date, new Date(2000, 1, 1))
            ? format(operation?.date, 'dd.MM.yyyy')
            : 'без даты'}
        </span>
      </div>

      {/* {operation?.number && operation?.type?.fields?.includes('number') && (
        <div className="bg-muted-foreground/5 text-semibold -mx-4 my-1 flex flex-row gap-2 truncate px-4">
          {operation?.number}
        </div>
      )} */}

      {((operation?.fio && operation?.type?.fields?.includes('fio')) ||
        (operation?.number && operation?.type?.fields?.includes('number'))) && (
        <div className="bg-muted-foreground/5 text-semibold lex-row -mx-4 my-1 flex  flex-row gap-2 truncate px-4">
          <span className="flex-shrink truncate">{operation?.fio || ''}</span>
          <span className="ml-auto flex-shrink-0">
            {operation?.number || ''}
          </span>
        </div>
      )}

      <div className="font-light">
        {operation?.notes
          ? operation?.notes
              .replace(/(?:\r\n|\r|\n|\n\n)/gi, '\\n')
              .split('\\n')
              .filter((item) => item !== '')
              .map((item, index) => {
                return (
                  <div
                    key={index}
                    className="border-muted-foreground/10 mb-1 border-b border-dashed pb-1 last-of-type:border-b-0 last-of-type:pb-0"
                  >
                    {item}
                    <br />
                  </div>
                );
              })
          : ''}
      </div>

      {hover && (
        <div className="bg-background absolute bottom-3 right-4 hidden flex-row items-center gap-2 rounded-full px-2 text-right text-xs font-thin shadow-sm group-hover:flex">
          <span>
            {operation?.createdAt
              ? format(operation?.createdAt, 'dd.MM.yyyy')
              : 'без даты'}
          </span>
          <DeleteEquityOperationButton operation={operation} />
          <EditEquityOperationButton operation={operation} />
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
