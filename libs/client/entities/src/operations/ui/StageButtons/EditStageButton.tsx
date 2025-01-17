import {
  Button,
  cn,
  setStageFormState,
  useUserAbility,
  Tooltip,
  setStageFormValuesFromStage,
  TooltipTrigger,
  TooltipContent,
} from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { Pencil } from 'lucide-react';
import { useDispatch } from 'react-redux';

type EditStageButtonProps = {
  stage: ControlStage;
  className?: string;
};

const EditStageButton = ({
  stage,
  className,
}: EditStageButtonProps): JSX.Element | null => {
  const dispatch = useDispatch();
  const i = useUserAbility();

  if (i.cannot('update', stage)) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn('size-6 rounded-full p-0', className)}
          variant={'ghost'}
          onClick={() => {
            dispatch(setStageFormValuesFromStage(stage));
            dispatch(setStageFormState('edit'));
          }}
        >
          <Pencil className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Редактировать этап</TooltipContent>
    </Tooltip>
  );
};

export { EditStageButton };
