import {
  guestUser,
  selectCurrentUser,
  selectDispatchFormState,
  selectReminderFormState,
  selectReminderFormValues,
  setReminderFormState,
  setReminderFormValuesEmpty,
  setReminderFormValuesFromDto,
} from '@urgp/client/shared';
import {
  ReminderFormValuesDto,
  reminderFormValuesDto,
} from '@urgp/shared/entities';

import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
import { useSelector } from 'react-redux';
import {
  useCreateReminder,
  useDeleteOperation,
  useMarkReminderAsDone,
  useReminders,
  useUpdateReminder,
} from '../api/operationsApi';
import { EditedReminderDisplayElement } from './ReminderFormElements/EditedReminderDisplayElement';
import { ReminderFormFieldArray } from './ReminderFormElements/ReminderFormFieldArray';

type CreateReminderDialogProps = {
  className?: string;
};

const CreateReminderDialog = ({
  className,
}: CreateReminderDialogProps): JSX.Element | null => {
  const isEdit = useSelector(selectDispatchFormState) === 'edit';
  const formValues = useSelector(selectReminderFormValues);
  const caseId = formValues?.caseId || 0;
  const {
    data: reminders,
    isLoading,
    isFetching,
  } = useReminders(caseId, { skip: caseId === 0 });
  const user = useSelector(selectCurrentUser) || guestUser;
  const userReminder = reminders?.find((rem) => {
    return rem?.payload?.observer?.id === user?.id;
  });

  const dialogProps = {
    isEdit,
    entityType: 'operation',
    dto: reminderFormValuesDto,
    valuesSelector: selectReminderFormValues,
    stateSelector: selectReminderFormState,
    stateDispatch: setReminderFormState,
    valuesEmptyDispatch: setReminderFormValuesEmpty,
    valuesDtoDispatch: setReminderFormValuesFromDto,
    updateHook: useUpdateReminder,
    createHook: useCreateReminder,
    allowDelete:
      !isLoading &&
      !isFetching &&
      formValues?.id !== 0 &&
      !userReminder?.payload?.doneDate,
    deleteHook: useMarkReminderAsDone, // ВОТ ТУТ НАДО БЫ КРЕПКО ПОДУМАТЬ
    FieldsArray: ReminderFormFieldArray,
    dialogWidth: '600px',
    className,
    createTitle: 'Добавить напоминание',
    editTitle: 'Изменить напоминание',
    createDescription: 'Внесите данные для отслеживания дела',
    editDescription: 'Внесите изменения отслеживание по делу',
    deleteButtonLabel: 'Снять напоминание',
    saveButtonLabel: 'Отслеживать дело',
  } as unknown as FormDialogProps<ReminderFormValuesDto>;

  return <FormDialog {...dialogProps} />;
};

export { CreateReminderDialog };
