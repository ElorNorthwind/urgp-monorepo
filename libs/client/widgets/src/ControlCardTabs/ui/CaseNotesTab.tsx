import { cn, ScrollArea } from '@urgp/client/shared';
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
      contentClassName={cn('max-h-72 flex flex-col p-0', contentClassName)}
      accordionItemName={accordionItemName}
    >
      {
        <ScrollArea className={cn('w-full flex-grow overflow-y-auto p-2')}>
          {controlCase?.notes
            .replace(/(?:\r\n|\r|\n|\n\n)/gi, '\\n')
            .split('\\n')
            .filter((item) => item !== '')
            .map((item, index) => {
              return (
                <div key={index} className="pb-1 indent-4 last-of-type:pb-0">
                  {item}
                  <br />
                </div>
              );
            })}
        </ScrollArea>
      }
    </CardTab>
  );
};

export { CaseNotesTab };
