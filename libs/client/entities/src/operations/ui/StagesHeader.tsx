import { cn } from '@urgp/client/shared';
import { CreateStageButton } from './CreateStageDialog';

type StagesHeaderProps = {
  caseId?: number;
  className?: string;
};

const StagesHeader = (props: StagesHeaderProps): JSX.Element => {
  const { caseId, className } = props;

  if (!caseId) return <></>;

  return (
    <div className={cn('flex items-center justify-between pr-6', className)}>
      <div className="font-medium">Работа с делом</div>
      {/* <CreateStageDialog caseId={caseId} /> */}
      <CreateStageButton caseId={caseId} />
    </div>
  );
};

export { StagesHeader };
