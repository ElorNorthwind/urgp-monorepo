import {
  Button,
  cn,
  setReminderFormCaseId,
  setReminderFormDueDate,
  setReminderFormState,
  setReminderFormValuesFromReminder,
  Skeleton,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useAuth,
  useUserAbility,
} from '@urgp/client/shared';
import {
  GET_DEFAULT_CONTROL_DUE_DATE,
  OperationClasses,
} from '@urgp/shared/entities';
import { Eye, ScanEye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { RemindersList } from '../../../cases';
import { useOperations } from '../../api/operationsApi';
import { formatISO } from 'date-fns';

type ManageReminderButtonProps = {
  caseId: number;
  expectedDate?: string; // ISO date
  disabled?: boolean;
  className?: string;
};

const ManageReminderButton = ({
  caseId,
  expectedDate = GET_DEFAULT_CONTROL_DUE_DATE(),
  disabled = false,
  className,
}: ManageReminderButtonProps): JSX.Element | null => {
  const dispatch = useDispatch();
  const i = useUserAbility();

  if (i.cannot('create', 'Reminder')) return null;

  const {
    data: reminders,
    isLoading,
    isFetching,
  } = useOperations(
    { class: OperationClasses.reminder, case: caseId },
    { skip: !caseId || caseId === 0 },
  );
  const user = useAuth();
  const userReminder = reminders?.find((rem) => {
    return rem?.controlFrom?.id === user?.id;
  });

  const onCreate = () => {
    dispatch(setReminderFormCaseId(caseId));
    dispatch(setReminderFormDueDate(expectedDate));
    dispatch(setReminderFormState('create'));
  };

  const onEdit = () => {
    if (!userReminder) return;
    dispatch(setReminderFormCaseId(caseId));
    dispatch(
      setReminderFormValuesFromReminder({
        ...userReminder,
        dueDate: userReminder?.dueDate || new Date(expectedDate).toISOString(),
      }),
    );
    dispatch(setReminderFormState('edit'));
  };

  if (isLoading || isFetching)
    return <Skeleton className={cn('h-8 w-32', className)} />;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="outline"
          role="button"
          disabled={disabled}
          className={cn('flex flex-grow flex-row gap-2', className)}
          onClick={() => {
            userReminder ? onEdit() : onCreate();
          }}
        >
          {!userReminder || userReminder?.doneDate ? (
            <>
              <Eye className="mr-1 size-4 flex-shrink-0 opacity-50" />
              <span>Отслеживать</span>
            </>
          ) : (
            <>
              <ScanEye className="mr-1 size-4 flex-shrink-0" />
              <span>Отслеживание</span>
            </>
          )}
        </Button>
      </TooltipTrigger>
      <TooltipContent side="left">
        <RemindersList reminders={reminders} label="Кто подписан на заявку?" />
      </TooltipContent>
    </Tooltip>
  );
};

export { ManageReminderButton };
