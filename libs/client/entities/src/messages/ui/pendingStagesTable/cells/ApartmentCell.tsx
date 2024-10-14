import { CellContext } from '@tanstack/react-table';
import { Badge, cn, HStack, VStack } from '@urgp/client/shared';
import { PendingStage, UnansweredMessage } from '@urgp/shared/entities';
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

function ApartmentCell(props: CellContext<PendingStage, string>): JSX.Element {
  const stage = props.row.original;
  const problems = JSON.parse(stage?.problems || '[]');
  const icon = useMemo(() => {
    if (stage.stage === 'В работе МФР') {
      return <CircleDollarSign className="h-8 w-8 text-violet-500" />;
    } else if (stage.deviation === 'Риск') {
      return <CircleX className="h-8 w-8 text-red-500" />;
    } else if (stage.deviation === 'Требует внимания') {
      return <CircleAlert className="h-8 w-8 text-yellow-500" />;
    } else if (stage.deviation === 'Работа завершена') {
      return <CircleCheck className="h-8 w-8 text-emerald-500" />;
    } else {
      return <CircleEllipsis className="h-8 w-8 text-sky-500" />;
    }
  }, [stage]);

  return (
    <HStack gap="s" className="overflow-hidden truncate">
      {icon}
      <VStack gap="none" align={'start'} className="flex-1 truncate">
        <div className="flex-1 truncate">
          <span className="font-bold">
            {'кв.' + stage.apartNum + ' (' + stage.apartType + ')'}
          </span>
          <span className="px-1">{stage.fio}</span>

          {problems.map((problem: string) => (
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
                ? stage.apartStatus === 'федеральная собственность'
                  ? 'Федеральная'
                  : stage.apartStatus.slice(0, 1).toLocaleUpperCase() +
                    stage.apartStatus.slice(1)
                : problem}
            </Badge>
          ))}
        </div>
        <div className="text-muted-foreground flex-1 truncate">
          {stage.action}
        </div>
      </VStack>
    </HStack>
  );
}

export { ApartmentCell };
