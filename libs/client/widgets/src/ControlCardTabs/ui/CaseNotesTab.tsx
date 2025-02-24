import { cn } from '@urgp/client/shared';
import { CaseFull } from '@urgp/shared/entities';

import { CardTab } from '@urgp/client/features';
import { ManageReminderButton } from '@urgp/client/entities';

type CaseNotesTabProps = {
  controlCase?: CaseFull;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const CaseNotesTab = (props: CaseNotesTabProps): JSX.Element | null => {
  const {
    controlCase,
    className,
    label = 'Описание дела',
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  if (!controlCase || !controlCase?.notes || controlCase?.notes?.length === 0)
    return null;

  return (
    <CardTab
      label={label}
      button={<ManageReminderButton caseId={controlCase?.id} />}
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn(contentClassName)}
      accordionItemName={accordionItemName}
    >
      {controlCase?.notes}
    </CardTab>
  );
};

export { CaseNotesTab };
