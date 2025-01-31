import {
  Button,
  cn,
  setCaseFormState,
  setCaseFormValuesFromCase,
  useUserAbility,
} from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { Edit } from 'lucide-react';
import { useDispatch } from 'react-redux';

type EditCaseButtonProps = {
  controlCase: Case;
  className?: string;
  label?: string;
};

const EditCaseButton = ({
  controlCase,
  className,
  label = 'Редактировать',
}: EditCaseButtonProps): JSX.Element | null => {
  const dispatch = useDispatch();
  const i = useUserAbility();

  if (i.cannot('update', controlCase)) return null;

  return (
    <Button
      variant={'outline'}
      className={cn('flex flex-grow flex-row gap-2', className)}
      onClick={() => {
        dispatch(setCaseFormValuesFromCase(controlCase));
        dispatch(setCaseFormState('edit'));
      }}
    >
      <Edit className="size-5 flex-shrink-0" />
      <span>{label}</span>
    </Button>
  );
};

export { EditCaseButton };
