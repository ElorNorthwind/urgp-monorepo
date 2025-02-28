import {
  Button,
  cn,
  selectStageFormValues,
  setStageFormCaseId,
  setStageFormState,
  useUserAbility,
} from '@urgp/client/shared';
import { DialogFormState } from '@urgp/shared/entities';
import { SquarePlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

type CreateStageButtonProps = {
  caseId: number;
  className?: string;
};

const CreateStageButton = ({
  caseId,
  className,
}: CreateStageButtonProps): JSX.Element | null => {
  const emptyValues = useSelector(selectStageFormValues);
  const dispatch = useDispatch();
  const i = useUserAbility();

  if (i.cannot('create', 'Stage')) return null;

  return (
    <Button
      variant={'outline'}
      className={cn('h-8 p-1', className)} // pr-2
      onClick={() => {
        dispatch(setStageFormCaseId(caseId));
        dispatch(setStageFormState(DialogFormState.create));
      }}
    >
      <SquarePlus className="mr-1 size-4 flex-shrink-0" />
      <span>
        {emptyValues?.saved ? 'Новый этап (продолжить)' : 'Новый этап'}
      </span>
    </Button>
  );
};

export { CreateStageButton };
