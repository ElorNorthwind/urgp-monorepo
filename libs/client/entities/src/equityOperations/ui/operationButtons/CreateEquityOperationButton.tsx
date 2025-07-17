import {
  Button,
  buttonVariants,
  cn,
  selectEquityOperationFormValues,
  setOperationFormFio,
  setOperationFormObjectId,
  setOperationFormState,
  useAuth,
  useEquityAbility,
} from '@urgp/client/shared';
import { DialogFormState } from '@urgp/shared/entities';
import { VariantProps } from 'class-variance-authority';
import { SquarePlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

type CreateEquityOperationButtonProps = {
  objectId?: number[];
  fio?: string | null;
  className?: string;
  label?: string;
  disabled?: boolean;
} & VariantProps<typeof buttonVariants>;

const CreateEquityOperationButton = ({
  objectId,
  className,
  fio,
  label,
  disabled,
  variant = 'outline',
}: CreateEquityOperationButtonProps): JSX.Element | null => {
  const emptyValues = useSelector(selectEquityOperationFormValues);
  const dispatch = useDispatch();
  const i = useEquityAbility();
  const user = useAuth();

  if (user?.id === 0 || i.cannot('create', 'EquityOperation') || !objectId)
    return null;

  return (
    <Button
      variant={variant}
      className={cn('h-8 p-1', className)} // pr-2
      disabled={disabled}
      onClick={() => {
        fio && dispatch(setOperationFormFio(fio));
        dispatch(setOperationFormObjectId(objectId));
        dispatch(setOperationFormState(DialogFormState.create));
      }}
    >
      <SquarePlus className="mr-1 size-4 flex-shrink-0" />
      <span>
        {label ||
          (emptyValues?.saved ? 'Новый этап (продолжить)' : 'Новый этап')}
      </span>
    </Button>
  );
};

export { CreateEquityOperationButton };
