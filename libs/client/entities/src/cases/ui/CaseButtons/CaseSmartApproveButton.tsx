import {
  guestUser,
  selectCurrentUser,
  useUserAbility,
} from '@urgp/client/shared';
import { ApproveButton } from '@urgp/client/widgets';
import { Case } from '@urgp/shared/entities';
import { useSelector } from 'react-redux';
import { useStages } from '../../../operations';

type CaseSmartApproveButtonProps = {
  controlCase: Case;
  variant?: 'mini' | 'default' | 'outline' | 'separated';
  className?: string;
  buttonClassName?: string;
  iconClassName?: string;
  approveCaseLabel?: string;
  approveOperationLabel?: string;
  rejectLabel?: string;
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
}: CaseSmartApproveButtonProps): JSX.Element | null => {
  const {
    data: stages,
    isLoading,
    isFetching,
  } = useStages(controlCase.id, { skip: !controlCase?.id });
  const user = useSelector(selectCurrentUser) || guestUser;
  const myPendingStage = stages?.find(
    (stage) =>
      stage.payload?.approveStatus === 'pending' &&
      stage.payload?.isDeleted !== true &&
      stage.payload?.approver.id === user.id,
  );

  const i = useUserAbility();

  if (isLoading || isFetching) return null;

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
