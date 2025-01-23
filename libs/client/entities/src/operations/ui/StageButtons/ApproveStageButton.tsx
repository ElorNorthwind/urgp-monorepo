import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { ApproveDialog } from '@urgp/client/widgets';
import { StageItem } from '../StagesList/StageItem';

type ApproveStageButtonProps = {
  stage: ControlStage;
  className?: string;
  variant?: 'mini' | 'default';
};

const ApproveStageButton = ({
  stage,
  className,
  variant = 'mini',
}: ApproveStageButtonProps): JSX.Element | null => {
  const i = useUserAbility();
  if (i.cannot('approve', stage)) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ApproveDialog
          className={className}
          entityId={stage.id}
          entityType="operation"
          variant={variant}
          displayedElement={<StageItem stage={stage} hover={false} />}
        />
      </TooltipTrigger>
      <TooltipContent>Вынести решение</TooltipContent>
    </Tooltip>
  );
};

export { ApproveStageButton };
