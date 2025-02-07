import { cn, useUserAbility } from '@urgp/client/shared';
import { CaseFull } from '@urgp/shared/entities';
import { CaseSmartApproveButton } from '../CaseButtons/CaseSmartApproveButton';
import { DeleteCaseButton } from '../CaseButtons/DeleteCaseButton';
import { EditCaseButton } from '../CaseButtons/EditCaseButton';

type CaseCardFooterProps = {
  className?: string;
  controlCase: CaseFull;
};

const CaseCardFooter = (props: CaseCardFooterProps): JSX.Element | null => {
  const { className, controlCase } = props;
  const myPendingStage = controlCase?.myPendingStage;
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
