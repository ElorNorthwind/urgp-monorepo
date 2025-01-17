import { cn, useUserAbility } from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { DeleteCaseButton } from '../CaseButtons/DeleteCaseButton';
import { EditCaseButton } from '../CaseButtons/EditCaseButton';
import { ApproveCaseButton } from '../CaseButtons/ApproveCaseButton';

type CaseCardFooterProps = {
  className?: string;
  controlCase: Case;
};

const CaseCardFooter = (props: CaseCardFooterProps): JSX.Element | null => {
  const { className, controlCase } = props;
  const i = useUserAbility();

  if (
    !controlCase ||
    (i.cannot('delete', controlCase) &&
      i.cannot('update', controlCase) &&
      i.cannot('approve', controlCase))
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
      <DeleteCaseButton controlCase={controlCase} />
      <EditCaseButton controlCase={controlCase} />
      <ApproveCaseButton controlCase={controlCase} />
    </div>
  );
};

export { CaseCardFooter };
