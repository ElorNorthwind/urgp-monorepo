import { cn, ScrollArea } from '@urgp/client/shared';
import { Coffee } from 'lucide-react';
import { StageItem } from './StageItem';
import { OperationFull } from '@urgp/shared/entities';

type StagesListProps = {
  stages?: OperationFull[];
  className?: string;
  isLoading?: boolean;
};

const StagesList = (props: StagesListProps): JSX.Element => {
  const { className, stages, isLoading } = props;

  if (!stages || stages?.length === 0) {
    return (
      <div className="text-muted-foreground/50 flex flex-col items-center gap-2 pt-4">
        <Coffee className="size-12 stroke-1" />
        <span>На рассмотрении...</span>
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
        <StageItem stage={null} />
      ) : (
        stages?.map((stage) => <StageItem stage={stage} key={stage.id} />)
      )}
    </ScrollArea>
  );
};

export { StagesList, StageItem };
