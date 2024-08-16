import { CellContext } from '@tanstack/react-table';
import { Badge, cn, HStack, VStack } from '@urgp/client/shared';
import { UnansweredMessage } from '@urgp/shared/entities';
import {
  CircleAlert,
  CircleCheck,
  CircleDollarSign,
  CircleEllipsis,
  CircleX,
} from 'lucide-react';
import { useMemo } from 'react';
const problemBadgeStyles = {
  МФР: cn('bg-violet-100 border-violet-200'),
  Отказ: cn('bg-amber-100 border-amber-200'),
  Суды: cn('bg-rose-100 border-rose-200'),
  Проблемная: cn('bg-slate-100 border-slate-200'),
};

function ApartmentCell(
  props: CellContext<UnansweredMessage, string>,
): JSX.Element {
  const message = props.row.original;
  const icon = useMemo(() => {
    if (message.stage === 'В работе МФР') {
      return <CircleDollarSign className="h-8 w-8 text-violet-500" />;
    } else if (message.deviation === 'Риск') {
      return <CircleX className="h-8 w-8 text-red-500" />;
    } else if (message.deviation === 'Требует внимания') {
      return <CircleAlert className="h-8 w-8 text-yellow-500" />;
    } else if (message.deviation === 'Работа завершена') {
      return <CircleCheck className="h-8 w-8 text-emerald-500" />;
    } else {
      return <CircleEllipsis className="h-8 w-8 text-sky-500" />;
    }
  }, [message]);

  return (
    <HStack gap="s" className="overflow-hidden truncate">
      {icon}
      <VStack gap="none" align={'start'} className="flex-1 truncate">
        <div className="flex-1 truncate">
          <span className="font-bold">
            {'кв.' + message.apartNum + ' (' + message.apartType + ')'}
          </span>
          <span className="px-1">{message.fio}</span>

          {message.problems.map((problem) => (
            <Badge
              key={problem}
              variant="outline"
              className={cn(
                'ml-1 h-4 px-1 text-xs',
                problemBadgeStyles?.[
                  problem as keyof typeof problemBadgeStyles
                ],
              )}
            >
              {problem === 'Проблемная'
                ? message.apartStatus === 'федеральная собственность'
                  ? 'Федеральная'
                  : message.apartStatus.slice(0, 1).toLocaleUpperCase() +
                    message.apartStatus.slice(1)
                : problem}
            </Badge>
          ))}
        </div>
        <div className="text-muted-foreground flex-1 truncate">
          {message.actionText}
        </div>
      </VStack>
    </HStack>
  );
}

export { ApartmentCell };
