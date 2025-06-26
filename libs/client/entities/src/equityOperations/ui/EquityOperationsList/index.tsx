import { cn, ScrollArea } from '@urgp/client/shared';
import { Coffee } from 'lucide-react';
import { EquityOperationItem } from './EquityOperationItem';
import { EquityOperation } from '@urgp/shared/entities';

type EquityOperationsListProps = {
  operations?: EquityOperation[];
  className?: string;
  isLoading?: boolean;
};

const EquityOperationsList = (
  props: EquityOperationsListProps,
): JSX.Element => {
  const { className, operations, isLoading } = props;

  if (!operations || operations?.length === 0) {
    return (
      <div className="text-muted-foreground/80 flex flex-col items-center gap-2 py-4">
        <Coffee className="size-12 stroke-1" />
        <span>Нет записанных действий</span>
      </div>
    );
  }
  return (
    <ScrollArea
      className={cn(
        'bg-background flex flex-col gap-2 rounded border',
        className,
      )}
    >
      {isLoading ? (
        <EquityOperationItem operation={null} key="op-skeleton" />
      ) : (
        operations?.map((operation) => (
          <EquityOperationItem operation={operation} key={operation.id} />
        ))
      )}
    </ScrollArea>
  );
};

export { EquityOperationsList, EquityOperationItem };
