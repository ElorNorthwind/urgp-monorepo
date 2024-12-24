import { cn } from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { CreateStageDialog } from './CreateStageDialog';

type StagesHeaderProps = {
  caseId?: number;
  className?: string;
  editStage: 'new' | ControlStage | null;
  setEditStage: React.Dispatch<
    React.SetStateAction<'new' | ControlStage | null>
  >;
};

const StagesHeader = (props: StagesHeaderProps): JSX.Element => {
  const { caseId, className, editStage, setEditStage } = props;

  if (!caseId) return <></>;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="font-medium">Работа с делом</div>
      {/* <Button variant={'outline'} className="h-8 p-1 pr-2">
        <SquarePlus className="mr-1 size-4 flex-shrink-0" />
        <span>Новый этап</span>
      </Button> */}
      <CreateStageDialog
        caseId={caseId}
        editStage={editStage}
        setEditStage={setEditStage}
      />
    </div>
  );
};

export { StagesHeader };
