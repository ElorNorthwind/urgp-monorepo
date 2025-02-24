import { cn } from '@urgp/client/shared';
import { CreateStageButton } from './StageButtons/CreateStageButton';

type StagesHeaderProps = {
  caseId?: number;
  className?: string;
};

const StagesHeader = (props: StagesHeaderProps): JSX.Element => {
  const { caseId, className } = props;

  if (!caseId) return <></>;

  return (
    <div className={cn('з- flex items-center justify-between', className)}>
      <div className="font-medium">Работа с делом</div>
      {/* <CreateStageDialog caseId={caseId} /> */}
      <CreateStageButton caseId={caseId} className="px-2" />
    </div>
  );
};

export { StagesHeader };
