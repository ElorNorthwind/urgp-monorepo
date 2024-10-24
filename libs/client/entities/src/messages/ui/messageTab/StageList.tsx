import { cn } from '@urgp/client/shared';
import { ExtendedStage, Stage } from '@urgp/shared/entities';
import { StageElement } from './StageElement';
import { Skull } from 'lucide-react';

type StageListProps = {
  stages: ExtendedStage[] | null;
  refetch: () => void;
  className?: string;
  editStage?: Stage | null;
  setEditStage?: React.Dispatch<React.SetStateAction<ExtendedStage | null>>;
};
const StageList = ({
  stages = [],
  refetch,
  className,
  editStage,
  setEditStage,
}: StageListProps): JSX.Element => {
  return (
    <div className={cn('flex flex-col gap-2', className)}>
      {!stages || stages?.length === 0 ? (
        <h1 className="bg-muted/40 flex w-full flex-col items-center rounded border border-dashed p-8 text-center">
          <span>Нет добавленных вручную этапов</span>
        </h1>
      ) : (
        stages.map((stage) => {
          return (
            <StageElement
              refetch={refetch}
              key={stage.id}
              stage={stage}
              className="w-full"
              editStage={editStage}
              setEditStage={setEditStage}
            />
          );
        })
      )}
    </div>
  );
};

export { StageList };
