import {
  Button,
  cn,
  guestUser,
  selectCurrentUser,
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
import { GET_DEFAULT_CONTROL_DUE_DATE } from '@urgp/shared/entities';
import { Eye, ScanEye } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import { useReminders } from '../../api/operationsApi';
import { RemindersList } from '../../../cases';
import { format } from 'date-fns';

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
  } = useReminders(caseId, { skip: !caseId });
  const user = useAuth();
  const userReminder = reminders?.find((rem) => {
    return rem?.payload?.observer?.id === user?.id;
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
        payload: {
          ...userReminder?.payload,
          dueDate: userReminder?.payload?.dueDate || new Date(expectedDate),
        },
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
          {!userReminder || userReminder?.payload?.doneDate ? (
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
