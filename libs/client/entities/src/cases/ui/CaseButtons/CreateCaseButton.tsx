import {
  Button,
  cn,
  selectCaseFormValues,
  setCaseFormState,
  useUserAbility,
} from '@urgp/client/shared';
import { SquarePlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

type CreateCaseButtonProps = {
  className?: string;
};

const CreateCaseButton = ({
  className,
}: CreateCaseButtonProps): JSX.Element | null => {
  const emptyValues = useSelector(selectCaseFormValues);
  const dispatch = useDispatch();
  const i = useUserAbility();

  if (i.cannot('create', 'Case')) return null;

  return (
    <Button
      variant={'outline'}
      className={cn('h-8 p-1', className)}
      onClick={() => dispatch(setCaseFormState('create'))}
    >
      <SquarePlus className="mr-1 size-4" />
      <p>{emptyValues?.saved ? 'Продолжить заполнение' : 'Добавить'}</p>
    </Button>
  );
};

export { CreateCaseButton };
