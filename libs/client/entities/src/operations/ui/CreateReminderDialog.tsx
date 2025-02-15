import {
  selectDispatchFormState,
  selectReminderFormState,
  selectReminderFormValues,
  setReminderFormState,
  setReminderFormValuesEmpty,
  setReminderFormValuesFromDto,
  useAuth,
} from '@urgp/client/shared';

import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
import { useSelector } from 'react-redux';

import { ReminderFormFieldArray } from './ReminderFormElements/ReminderFormFieldArray';
import {
  useCreateOperation,
  useMarkReminderAsDone,
  useOperations,
  useUpdateOperation,
} from '../api/operationsApi';
import {
  OperationClasses,
  OperationFormDto,
  ReminderFormDto,
  reminderFormSchema,
} from '@urgp/shared/entities';

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
  } = useOperations(
    { class: OperationClasses.reminder, case: caseId },
    { skip: !caseId || caseId === 0 },
  );
  const user = useAuth();
  const userReminder = reminders?.find((rem) => {
    return rem?.controlFrom?.id === user?.id;
  });

  const dialogProps = {
    isEdit,
    entityType: 'operation',
    dto: reminderFormSchema,
    valuesSelector: selectReminderFormValues,
    stateSelector: selectReminderFormState,
    stateDispatch: setReminderFormState,
    valuesEmptyDispatch: setReminderFormValuesEmpty,
    valuesDtoDispatch: setReminderFormValuesFromDto,
    updateHook: useUpdateOperation,
    createHook: useCreateOperation,
    allowDelete:
      !isLoading &&
      !isFetching &&
      formValues?.id !== 0 &&
      !userReminder?.doneDate,
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
    customizeDefaultValues: (values: OperationFormDto) => ({
      ...values,
      controlFromId: user?.id,
      typeId: 11,
    }),
    customizeCreateValues: (values: OperationFormDto) => ({
      ...values,
      controlFromId: user?.id,
      typeId: 11,
    }),
    customizeUpdateValues: (values: OperationFormDto) => ({
      ...values,
      controlFromId: user?.id,
      typeId: 11,
    }),
    customizeDeleteValues: (values: OperationFormDto) => values?.id,
    alwaysSaveEdit: true,
  } as unknown as FormDialogProps<ReminderFormDto>;

  return <FormDialog {...dialogProps} />;
};

export { CreateReminderDialog };
