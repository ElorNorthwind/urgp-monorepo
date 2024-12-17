import { cn, ScrollArea } from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { Coffee } from 'lucide-react';
import { StageItem } from './StageItem';

type StagesListProps = {
  stages?: ControlStage[];
  className?: string;
  isLoading?: boolean;
  setEditStage?: React.Dispatch<React.SetStateAction<ControlStage | null>>;
};

const StagesList = (props: StagesListProps): JSX.Element => {
  const { className, stages, isLoading, setEditStage } = props;

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
        stages?.map((stage) => (
          <StageItem stage={stage} key={stage.id} setEditStage={setEditStage} />
        ))
      )}
    </ScrollArea>
  );
};

export { StagesList };
