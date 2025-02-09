import {
  selectCurrentUser,
  selectDispatchFormState,
  selectDispatchFormValues,
  setDispatchFormState,
  setDispatchFormValuesEmpty,
  setDispatchFormValuesFromDto,
  store,
  useUserAbility,
} from '@urgp/client/shared';

import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
import {
  useCreateOperation,
  useDeleteOperation,
  useOperations,
  useUpdateOperation,
} from '../api/operationsApi';
import { useSelector } from 'react-redux';
import { DispatchFormFieldArray } from './DispatchFormElements/DispatchFormFieldArray';
import { EditedDispatchDisplayElement } from './DispatchFormElements/EditedDispatchDisplayElement';
import {
  ControlOptions,
  DispatchFormDto,
  dispatchFormSchema,
  OperationClasses,
  OperationFormDto,
} from '@urgp/shared/entities';

type CreateDispatchDialogProps = {
  className?: string;
};

const CreateDispatchDialog = ({
  className,
}: CreateDispatchDialogProps): JSX.Element | null => {
  const isEdit = useSelector(selectDispatchFormState) === 'edit';
  const user = useSelector(selectCurrentUser);

  const formValues = useSelector(selectDispatchFormValues);
  const { data: dispatches, isLoading: isDispatshesLoading } = useOperations(
    { class: OperationClasses.dispatch, case: formValues?.caseId || 0 },
    {
      skip: !formValues?.caseId || formValues?.caseId === 0,
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
    dto: dispatchFormSchema,
    valuesSelector: selectDispatchFormValues,
    stateSelector: selectDispatchFormState,
    stateDispatch: setDispatchFormState,
    valuesEmptyDispatch: setDispatchFormValuesEmpty,
    valuesDtoDispatch: setDispatchFormValuesFromDto,
    updateHook: useUpdateOperation,
    createHook: useCreateOperation,
    deleteHook: useDeleteOperation,
    allowDelete: canDelete,
    FieldsArray: DispatchFormFieldArray,
    customizeDefaultValues: (values: OperationFormDto) => ({
      ...values,
      class: 'dispatch',
    }),
    customizeCreateValues: (values: OperationFormDto) => ({
      ...values,
      class: 'dispatch',
      approveStatus: 'approved',
      approveDate: new Date().toISOString(),
      controlFromId:
        values.controller === ControlOptions.author
          ? user?.id
          : values.controlToId,
    }),
    customizeUpdateValues: (values: OperationFormDto) => ({
      ...values,
      class: 'dispatch',
      controlFromId:
        values.controller === ControlOptions.executor
          ? values?.controlToId
          : user?.id,
      dateDescription:
        values.extra ||
        (values?.dueDate ===
        store.getState().control.dispatchForm.values?.dueDate
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
  } as unknown as FormDialogProps<DispatchFormDto>;

  return <FormDialog {...dialogProps} />;
};

export { CreateDispatchDialog };
