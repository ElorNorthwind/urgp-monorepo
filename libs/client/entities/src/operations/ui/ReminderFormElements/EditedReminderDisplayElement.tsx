import {
  cn,
  selectReminderFormState,
  selectReminderFormValues,
} from '@urgp/client/shared';
import { format } from 'date-fns';
import { useSelector } from 'react-redux';

type EditedReminderDisplayElementProps = {
  className?: string;
};

const EditedReminderDisplayElement = ({
  className,
}: EditedReminderDisplayElementProps): JSX.Element | null => {
  const isEdit = useSelector(selectReminderFormState) === 'edit';
  const doneDate = useSelector(selectReminderFormValues)?.doneDate || 0;
  if (!isEdit || !doneDate) return null;

  return (
    <div
      className={cn(
        'bg-muted-foreground/5 ml-auto flex flex-row items-center gap-2 rounded border px-4 py-2 text-right',
        className,
      )}
    >
      <span className="font-semibold">Напоминание снято</span>
      <span className="">{format(doneDate, 'dd.MM.yyyy')}</span>
    </div>
  );
};

export { EditedReminderDisplayElement };
