import {
  guestUser,
  selectCurrentUser,
  useAuth,
  useUserAbility,
} from '@urgp/client/shared';
import { ApproveButton } from '@urgp/client/widgets';
import { CaseFull, OperationClasses } from '@urgp/shared/entities';
import { useOperations } from '../../../operations';

type CaseSmartApproveButtonProps = {
  controlCase: CaseFull;
  variant?: 'mini' | 'default' | 'outline' | 'separated';
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  approveCaseLabel?: string;
  approveOperationLabel?: string;
  rejectLabel?: string;
  isLoading?: boolean;
};

const CaseSmartApproveButton = ({
  controlCase,
  variant = 'default',
  approveCaseLabel = 'Рассмотреть дело',
  approveOperationLabel = 'Рассмотреть этап',
  rejectLabel = 'Отклонить',
  className,
  buttonClassName,
  iconClassName,
  isLoading,
}: CaseSmartApproveButtonProps): JSX.Element | null => {
  const myPendingStage = controlCase?.myPendingStage;
  const i = useUserAbility();

  if (isLoading) return null;

  if (i.can('approve', controlCase)) {
    return (
      <ApproveButton
        variant={variant}
        entity={controlCase}
        approveLabel={approveCaseLabel}
        rejectLabel={rejectLabel}
        className={className}
        buttonClassName={buttonClassName}
        iconClassName={iconClassName}
      />
    );
  } else if (myPendingStage && i.can('approve', myPendingStage)) {
    return (
      <ApproveButton
        variant={variant}
        entity={myPendingStage}
        approveLabel={approveOperationLabel}
        rejectLabel={rejectLabel}
        className={className}
        buttonClassName={buttonClassName}
        iconClassName={iconClassName}
      />
    );
  }
  return null;
};
export { CaseSmartApproveButton };
