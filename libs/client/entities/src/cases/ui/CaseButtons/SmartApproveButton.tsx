import {
  guestUser,
  selectCurrentUser,
  useUserAbility,
} from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { CaseCardHeader } from '../CaseCard/CaseCardHeader';
import { ApproveDialog } from '@urgp/client/widgets';
import { StageItem, useStages } from '../../../operations';
import { useSelector } from 'react-redux';

type SmartApproveButtonProps = {
  controlCase: Case;
  variant?: 'default' | 'mini' | 'ghost' | 'outline';
  className?: string;
};

const SmartApproveButton = ({
  controlCase,
  variant = 'default',
  className,
}: SmartApproveButtonProps): JSX.Element | null => {
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
      <ApproveDialog
        variant={variant}
        buttonLabel="Заявка"
        className={className}
        entityId={controlCase.id}
        entityType="case"
        displayedElement={
          <div>
            <CaseCardHeader controlCase={controlCase} className="rounded-t" />
            <div className="bg-sidebar/80 max-h-50 overflow-hidden rounded-b border-t p-4">
              {controlCase?.payload?.description}
            </div>
          </div>
        }
      />
    );
  } else if (myPendingStage && i.can('approve', myPendingStage)) {
    return (
      <ApproveDialog
        variant={variant}
        buttonLabel="Решение"
        className={className}
        entityId={myPendingStage.id}
        entityType="operation"
        displayedElement={<StageItem stage={myPendingStage} hover={false} />}
      />
    );
  }
  return <div>{JSON.stringify(myPendingStage?.class)}</div>;
};
export { SmartApproveButton };
