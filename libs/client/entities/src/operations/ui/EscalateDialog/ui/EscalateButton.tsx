import {
  Button,
  buttonVariants,
  cn,
  setEscalateFormCaseId,
  setEscalateFormState,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useUserAbility,
} from '@urgp/client/shared';
import {
  CaseActions,
  CaseFull,
  CONTROL_THRESHOLD,
  EscalateFormState,
} from '@urgp/shared/entities';
import { VariantProps } from 'class-variance-authority';
import { HandHelping } from 'lucide-react';
import { useDispatch } from 'react-redux';

type EscalateButtonProps = {
  controlCase: CaseFull;
  className?: string;
  label?: string;
  alwaysOn?: boolean;
} & VariantProps<typeof buttonVariants>;

const EscalateButton = (props: EscalateButtonProps): JSX.Element | null => {
  const {
    controlCase,
    className,
    size,
    variant = 'outline',
    label = 'Эскалация',
    alwaysOn = false,
  } = props;

  // const user = useAuth();
  const i = useUserAbility();
  const dispatch = useDispatch();

  if (i.cannot('escalate', controlCase)) return null;
  if (
    alwaysOn === false &&
    ((!controlCase?.actions.some((ac) =>
      [CaseActions.reminderOverdue, CaseActions.reminderDone].includes(
        ac as any,
      ),
    ) &&
      controlCase?.status?.id !== 11) ||
      !controlCase?.myReminder ||
      controlCase?.escalations === 0 ||
      controlCase?.controlLevel >= CONTROL_THRESHOLD)
  )
    return null;

  const onClick = () => {
    if (!controlCase?.id) return;
    dispatch(setEscalateFormCaseId(controlCase?.id));
    dispatch(setEscalateFormState(EscalateFormState.open));
  };

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          role="button"
          size={size}
          variant={variant}
          onClick={onClick}
          className={cn('flex flex-grow flex-row gap-2', className)}
        >
          <HandHelping className={cn('size-6 flex-shrink-0')} />
          <span className="flex-shrink truncate">{label}</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>Запросить заключение руководства по делу</TooltipContent>
    </Tooltip>
  );
};

export { EscalateButton };
