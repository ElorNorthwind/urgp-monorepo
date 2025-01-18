import {
  selectCurrentUser,
  selectDispatchFormState,
  selectDispatchFormValues,
  setDispatchFormState,
  setDispatchFormValuesEmpty,
  setDispatchFormValuesFromDto,
  useUserAbility,
} from '@urgp/client/shared';
import {
  DispatchFormValuesDto,
  dispatchFormValuesDto,
} from '@urgp/shared/entities';

import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
import {
  useCreateDispatch,
  useDeleteOperation,
  useDispatches,
  useUpdateDispatch,
} from '../api/operationsApi';
import { useSelector } from 'react-redux';
import { DispatchFormFieldArray } from './DispatchFormElements/DispatchFormFieldArray';
import { EditedDispatchDisplayElement } from './DispatchFormElements/EditedDispatchDisplayElement';
import { exec } from 'child_process';

type CreateDispatchDialogProps = {
  className?: string;
};

const CreateDispatchDialog = ({
  className,
}: CreateDispatchDialogProps): JSX.Element | null => {
  const isEdit = useSelector(selectDispatchFormState) === 'edit';
  const user = useSelector(selectCurrentUser);

  const formValues = useSelector(selectDispatchFormValues);
  const { data: dispatches, isLoading: isDispatshesLoading } = useDispatches(
    formValues?.caseId || 0,
    {
      skip: !formValues?.caseId,
    },
  );
  const editedDispatch = dispatches?.find((d) => d.id === formValues?.id);

  const i = useUserAbility();
  const canDelete =
    editedDispatch &&
    !isDispatshesLoading &&
    i.can('delete', editedDispatch) &&
    isEdit;

  const dialogProps = {
    isEdit,
    entityType: 'operation',
    dto: dispatchFormValuesDto,
    valuesSelector: selectDispatchFormValues,
    stateSelector: selectDispatchFormState,
    stateDispatch: setDispatchFormState,
    valuesEmptyDispatch: setDispatchFormValuesEmpty,
    valuesDtoDispatch: setDispatchFormValuesFromDto,
    updateHook: useUpdateDispatch,
    createHook: useCreateDispatch,
    deleteHook: useDeleteOperation,
    allowDelete: canDelete,
    FieldsArray: DispatchFormFieldArray,
    customizeDefaultValues: (values: DispatchFormValuesDto) => ({
      ...values,
      class: 'dispatch',
    }),
    customizeCreateValues: (values: DispatchFormValuesDto) => ({
      ...values,
      class: 'dispatch',
      controllerId:
        values.controller === 'author' ? user?.id : values.executorId,
    }),
    customizeUpdateValues: (values: DispatchFormValuesDto) => ({
      ...values,
      class: 'dispatch',
      controllerId:
        values.controller === 'executor' ? values?.executorId : user?.id,
      dateDescription:
        values.dateDescription ||
        (values?.dueDate === useSelector(selectDispatchFormValues)?.dueDate
          ? 'Корректировка без уточнения срока'
          : ''),
    }),
    displayedElement: <EditedDispatchDisplayElement />,
    dialogWidth: '600px',
    className,
    createTitle: 'Добавить поручение',
    editTitle: 'Изменить поручение',
    createDescription: 'Внесите данные для создания поручения',
    editDescription: 'Внесите изменения в запись об поручении',
  } as unknown as FormDialogProps<DispatchFormValuesDto>;

  return <FormDialog {...dialogProps} />;
};

export { CreateDispatchDialog };
