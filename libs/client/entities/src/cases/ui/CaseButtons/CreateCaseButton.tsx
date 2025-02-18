import {
  Button,
  buttonVariants,
  cn,
  selectCaseFormValues,
  selectProblemFormValues,
  setCaseFormState,
  setProblemFormState,
  useUserAbility,
} from '@urgp/client/shared';
import { CaseClasses, DialogFormState } from '@urgp/shared/entities';
import { VariantProps } from 'class-variance-authority';
import { SquarePlus } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';

type CreateCaseButtonProps = {
  caseClass?: CaseClasses;
  className?: string;
  label?: string;
} & VariantProps<typeof buttonVariants>;

const CreateCaseButton = ({
  caseClass = CaseClasses.incident,
  className,
  label,
  variant = 'outline',
  size,
}: CreateCaseButtonProps): JSX.Element | null => {
  const emptyIncidentValues = useSelector(selectCaseFormValues);
  const emptyProblemtValues = useSelector(selectProblemFormValues);
  const emptyValues =
    caseClass === CaseClasses.problem
      ? emptyProblemtValues
      : emptyIncidentValues;
  const dispatch = useDispatch();
  const i = useUserAbility();

  if (i.cannot('create', 'Case')) return null;

  return (
    <Button
      role="button"
      variant={variant}
      size={size}
      className={cn('h-8 p-1', className)}
      onClick={(e) => {
        e.preventDefault();
        caseClass === CaseClasses.problem
          ? dispatch(setProblemFormState(DialogFormState.create))
          : dispatch(setCaseFormState(DialogFormState.create));
      }}
    >
      <SquarePlus className="mr-1 size-4" />
      <p>
        {label
          ? label
          : emptyValues?.saved
            ? 'Продолжить заполнение'
            : 'Добавить'}
      </p>
    </Button>
  );
};

export { CreateCaseButton };
