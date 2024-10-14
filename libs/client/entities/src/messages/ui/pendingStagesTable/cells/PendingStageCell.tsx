import { CellContext } from '@tanstack/react-table';
import { Badge, cn, HStack, VStack } from '@urgp/client/shared';
import { PendingStage, UnansweredMessage } from '@urgp/shared/entities';
import { format } from 'date-fns';
import {
  ArrowRight,
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

function PendingStageCell(
  props: CellContext<PendingStage, string>,
): JSX.Element {
  const stage = props.row.original;
  return (
    <HStack gap="s" className="overflow-hidden truncate">
      <ArrowRight className="h-8 w-8" />
      <VStack gap="none" align={'start'} className="flex-1 truncate">
        <div className="flex-1 truncate">
          <span className="font-bold">{stage.pendingStageName}</span>
          <span className="px-1">{`от ${format(stage.pendingDocDate, 'dd.MM.yyyy')} № ${stage.pendingDocNum}`}</span>
        </div>
        <div className="text-muted-foreground flex-1 truncate">
          <span className="font-bold">{`${stage.authorFio}: `}</span>
          <span>{stage.pendingAction}</span>
        </div>
      </VStack>
    </HStack>
  );
}

export { PendingStageCell };
