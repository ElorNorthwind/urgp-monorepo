import {
  Button,
  cn,
  setCaseFormState,
  setCaseFormValuesFromCase,
  setProblemFormState,
  setProblemFormValuesFromProblem,
  useUserAbility,
} from '@urgp/client/shared';
import { CaseClasses, CaseFull, DialogFormState } from '@urgp/shared/entities';
import { Edit } from 'lucide-react';
import { useDispatch } from 'react-redux';

type EditCaseButtonProps = {
  controlCase: CaseFull;
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
        if (controlCase.class === CaseClasses.problem) {
          dispatch(setProblemFormValuesFromProblem(controlCase));
          dispatch(setProblemFormState(DialogFormState.edit));
        } else if (controlCase.class === CaseClasses.incident) {
          dispatch(setCaseFormValuesFromCase(controlCase));
          dispatch(setCaseFormState(DialogFormState.edit));
        }
      }}
    >
      <Edit className="size-4 flex-shrink-0" />
      <span>{label}</span>
    </Button>
  );
};

export { EditCaseButton };
