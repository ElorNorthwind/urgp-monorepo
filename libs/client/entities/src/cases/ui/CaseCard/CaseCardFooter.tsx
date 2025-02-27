import { cn, useUserAbility } from '@urgp/client/shared';
import { ApproveButton } from '@urgp/client/widgets';
import { ApproveStatus, CaseFull } from '@urgp/shared/entities';
import { CaseSmartActionsMenu } from '../CaseButtons/CaseSmartActionsMenu';
import { DeleteCaseButton } from '../CaseButtons/DeleteCaseButton';
import { EditCaseButton } from '../CaseButtons/EditCaseButton';

type CaseCardFooterProps = {
  className?: string;
  controlCase: CaseFull;
};

const CaseCardFooter = (props: CaseCardFooterProps): JSX.Element | null => {
  const { className, controlCase } = props;
  const i = useUserAbility();

  if (
    !controlCase ||
    (i.cannot('delete', controlCase) &&
      i.cannot('update', controlCase) &&
      controlCase?.actions?.length === 0)
  ) {
    return null;
  }

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 mt-auto flex w-full flex-shrink-0 flex-wrap justify-stretch gap-4 truncate p-4',
        className,
      )}
    >
      {/* {controlCase?.id && <CaseSmartActions caseId={controlCase.id} />} */}
      <DeleteCaseButton controlCase={controlCase} />
      <EditCaseButton controlCase={controlCase} />
      {controlCase?.approveStatus === ApproveStatus.project && (
        <ApproveButton entity={controlCase} approveLabel="Направить проект" />
      )}
      <CaseSmartActionsMenu
        controlCase={controlCase}
        className="flex-grow justify-center"
      />
      {/* <CaseSmartApproveButton controlCase={controlCase} variant="default" /> */}
      {/* <EscalateButton controlCase={controlCase} /> */}
    </div>
  );
};

export { CaseCardFooter };
