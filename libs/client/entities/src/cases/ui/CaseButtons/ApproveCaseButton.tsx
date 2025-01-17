import { useUserAbility } from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { CaseCardHeader } from '../CaseCard/CaseCardHeader';
import { ApproveDialog } from '@urgp/client/widgets';

type ApproveCaseButtonProps = {
  controlCase: Case;
  className?: string;
};

const ApproveCaseButton = ({
  controlCase,
  className,
}: ApproveCaseButtonProps): JSX.Element | null => {
  const i = useUserAbility();
  if (i.cannot('approve', controlCase)) return null;

  return (
    <ApproveDialog
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
};

export { ApproveCaseButton };
