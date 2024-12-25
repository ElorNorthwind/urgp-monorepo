import { cn } from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { CreateStageDialog } from './CreateStage/CreateStageDialog';

type StagesHeaderProps = {
  caseId?: number;
  className?: string;
};

const StagesHeader = (props: StagesHeaderProps): JSX.Element => {
  const { caseId, className } = props;

  if (!caseId) return <></>;

  return (
    <div className={cn('flex items-center justify-between', className)}>
      <div className="font-medium">Работа с делом</div>
      <CreateStageDialog caseId={caseId} />
    </div>
  );
};

export { StagesHeader };
