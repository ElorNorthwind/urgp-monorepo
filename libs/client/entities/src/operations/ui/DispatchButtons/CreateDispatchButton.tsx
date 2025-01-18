import {
  Button,
  cn,
  setDispatchFormCaseId,
  setDispatchFormState,
  useUserAbility,
} from '@urgp/client/shared';
import { CalendarPlus } from 'lucide-react';
import { useDispatch } from 'react-redux';

type CreateDispatchButtonProps = {
  caseId: number;
  className?: string;
};

const CreateDispatchButton = ({
  caseId,
  className,
}: CreateDispatchButtonProps): JSX.Element | null => {
  const dispatch = useDispatch();
  const i = useUserAbility();

  if (i.cannot('create', 'Dispatch')) return null;

  return (
    <Button
      variant="outline"
      role="button"
      className={cn('flex flex-grow flex-row gap-2', className)}
      onClick={() => {
        dispatch(setDispatchFormCaseId(caseId));
        dispatch(setDispatchFormState('create'));
      }}
    >
      <CalendarPlus className="size-5" />
      <span>Новое поручение</span>
    </Button>
  );
};

export { CreateDispatchButton };
