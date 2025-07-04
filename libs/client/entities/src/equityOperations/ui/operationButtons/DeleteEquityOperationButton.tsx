import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useEquityAbility,
} from '@urgp/client/shared';
import { ConfirmationButton } from '@urgp/client/widgets';
import { EquityOperation } from '@urgp/shared/entities';
import { toast } from 'sonner';
import { useDeleteEquityOperation } from '../../api/equityOperationsApi';

type DeleteEquityOperationButtonProps = {
  operation: EquityOperation;
  className?: string;
};

const DeleteEquityOperationButton = ({
  operation,
  className,
}: DeleteEquityOperationButtonProps): JSX.Element | null => {
  const [deleteOperation, { isLoading: isDeleteLoading }] =
    useDeleteEquityOperation();
  const i = useEquityAbility();
  if (i.cannot('delete', operation)) return null;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <ConfirmationButton
          onAccept={() => {
            deleteOperation({ id: operation.id })
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

export { DeleteEquityOperationButton };
