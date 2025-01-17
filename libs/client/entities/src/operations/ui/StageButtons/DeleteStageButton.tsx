import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import { ControlStage } from '@urgp/shared/entities';
import { toast } from 'sonner';
import { ConfirmationButton } from '@urgp/client/widgets';
import { useDeleteOperation } from '../../api/operationsApi';

type DeleteStageButtonProps = {
  stage: ControlStage;
  className?: string;
};

const DeleteStageButton = ({
  stage,
  className,
}: DeleteStageButtonProps): JSX.Element | null => {
  const [deleteStage, { isLoading: isDeleteLoading }] = useDeleteOperation();

  const i = useUserAbility();

  if (i.cannot('delete', stage)) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ConfirmationButton
          onAccept={() => {
            deleteStage({
              id: stage.id,
            })
              .unwrap()
              .then(() => {
                toast.success('Операция удалена');
              })
              .catch((rejected: any) =>
                toast.error('Не удалось Удалить операцию', {
                  description: rejected.data?.message || 'Неизвестная ошибка',
                }),
              );
          }}
          disabled={isDeleteLoading}
          label="Удалить?"
          className={className}
        />
      </TooltipTrigger>
      <TooltipContent>Удалить этап</TooltipContent>
    </Tooltip>
  );
};

export { DeleteStageButton };
