import {
  cn,
  guestUser,
  selectCurrentUser,
  useAuth,
  useUserAbility,
} from '@urgp/client/shared';
import { CaseFull } from '@urgp/shared/entities';
import { DeleteCaseButton } from '../CaseButtons/DeleteCaseButton';
import { EditCaseButton } from '../CaseButtons/EditCaseButton';
import { ApproveButton } from '@urgp/client/widgets';
import { useStages } from '../../../operations';
import { useSelector } from 'react-redux';
import { CaseSmartApproveButton } from '../CaseButtons/CaseSmartApproveButton';
import { CaseSmartActions } from '../CaseButtons/CaseSmartActions';

type CaseCardFooterProps = {
  className?: string;
  controlCase: Case;
};

const CaseCardFooter = (props: CaseCardFooterProps): JSX.Element | null => {
  const { className, controlCase } = props;
  const { data: stages } = useStages(controlCase?.id, {
    skip: !controlCase?.id,
  });
  const user = useAuth();
  const myPendingStage = stages?.find(
    (stage) =>
      stage.payload?.approveStatus === 'pending' &&
      stage.payload?.isDeleted !== true &&
      stage.payload?.approver?.id === user?.id,
  );

  const i = useUserAbility();

  if (
    !controlCase ||
    (i.cannot('delete', controlCase) &&
      i.cannot('update', controlCase) &&
      i.cannot('approve', controlCase) &&
      myPendingStage &&
      i.cannot('approve', myPendingStage))
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 mt-auto flex w-full flex-shrink-0 justify-stretch gap-4 truncate p-4',
        className,
      )}
    >
      {/* {controlCase?.id && <CaseSmartActions caseId={controlCase.id} />} */}
      <DeleteCaseButton controlCase={controlCase} />
      <EditCaseButton controlCase={controlCase} />
      <CaseSmartApproveButton controlCase={controlCase} variant="default" />
    </div>
  );
};

export { CaseCardFooter };
