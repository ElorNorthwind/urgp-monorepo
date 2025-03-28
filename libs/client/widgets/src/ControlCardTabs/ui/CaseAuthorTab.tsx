import { cn, ScrollArea } from '@urgp/client/shared';
import { ApproveStatus, CaseFull } from '@urgp/shared/entities';

import { CardTab } from '@urgp/client/features';
import { ManageReminderButton } from '@urgp/client/entities';
import { format } from 'date-fns';
import { control } from 'leaflet';
import { ArrowRight } from 'lucide-react';

type CaseAuthorTabProps = {
  controlCase?: CaseFull;
  label?: string | null;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
  accordionItemName?: string;
};

const CaseAuthorTab = (props: CaseAuthorTabProps): JSX.Element | null => {
  const {
    controlCase,
    className,
    label = 'Движение дела',
    titleClassName,
    contentClassName,
    accordionItemName,
  } = props;

  if (!controlCase || !controlCase?.notes || controlCase?.notes?.length === 0)
    return null;

  return (
    <CardTab
      label={label}
      className={className}
      titleClassName={titleClassName}
      contentClassName={cn(
        'flex flex-col border-0 bg-transparent p-0',
        contentClassName,
      )}
      accordionItemName={accordionItemName}
    >
      <div className="flex flex-row justify-between">
        <div>Создал:</div>
        <div>{controlCase?.author?.fio || '-'}</div>
        <div>{format(controlCase?.createdAt, 'dd.MM.yyyy')}</div>
      </div>
      {controlCase?.approveStatus === ApproveStatus.approved &&
        controlCase?.approveDate && (
          <div className="flex flex-row justify-between">
            <div>Утвердил:</div>
            <div>{controlCase?.approveFrom?.fio || '-'}</div>
            <div>{format(controlCase?.approveDate, 'dd.MM.yyyy')}</div>
          </div>
        )}
      {controlCase?.approveStatus === ApproveStatus.pending && (
        <div className="flex flex-row justify-between">
          <div>На согласовании:</div>
          <div>{controlCase?.approveFrom?.fio || '-'}</div>
          <ArrowRight className="size-4 flex-shrink-0" />
          <div>{controlCase?.approveTo?.fio || '-'}</div>
        </div>
      )}
      {controlCase?.approveStatus === ApproveStatus.rejected &&
        controlCase?.approveDate && (
          <div className="flex flex-row justify-between">
            <div>Отклонил:</div>
            <div>{controlCase?.approveFrom?.fio || '-'}</div>
            <div>{format(controlCase?.approveDate, 'dd.MM.yyyy')}</div>
          </div>
        )}
    </CardTab>
  );
};

export { CaseAuthorTab };
