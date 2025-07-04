import {
  Button,
  cn,
  setOperationFormState,
  setOperationFormValuesFromOperation,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useEquityAbility,
} from '@urgp/client/shared';
import { DialogFormState, EquityOperation } from '@urgp/shared/entities';
import { Edit, Pencil } from 'lucide-react';
import { useDispatch } from 'react-redux';

type EditEquityOperationButtonProps = {
  operation: EquityOperation;
  className?: string;
  label?: string;
};

const EditEquityOperationButton = ({
  operation,
  className,
  label = 'Редактировать',
}: EditEquityOperationButtonProps): JSX.Element | null => {
  const dispatch = useDispatch();
  const i = useEquityAbility();

  if (i.cannot('update', operation)) return null;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          className={cn('size-6 rounded-full p-0', className)}
          variant={'ghost'}
          onClick={() => {
            dispatch(setOperationFormValuesFromOperation(operation));
            dispatch(setOperationFormState(DialogFormState.edit));
          }}
        >
          <Pencil className="size-4" />
        </Button>
      </TooltipTrigger>
      <TooltipContent>Редактировать операцию</TooltipContent>
    </Tooltip>
  );
};

export { EditEquityOperationButton };
