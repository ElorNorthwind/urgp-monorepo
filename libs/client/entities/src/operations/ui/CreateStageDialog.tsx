import {
  selectStageFormState,
  selectStageFormValues,
  setStageFormState,
  setStageFormValuesEmpty,
  setStageFormValuesFromDto,
} from '@urgp/client/shared';
import {
  useCurrentUserApproveTo,
  useOperationTypesFlat,
} from '../../classificators';

import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
import {
  useCreateOperation,
  useDeleteOperation,
  useUpdateOperation,
} from '../api/operationsApi';
import { StageFormFieldArray } from './StageFormElements/StageFormFieldArray';
import { useSelector } from 'react-redux';
import { EditedStageDisplayElement } from './StageFormElements/EditedStageDisplayElement';
import { OperationFormDto, operationFormSchema } from '@urgp/shared/entities';

type CreateStageDialogProps = {
  className?: string;
};

const CreateStageDialog = ({
  className,
}: CreateStageDialogProps): JSX.Element | null => {
  const { data: approvers } = useCurrentUserApproveTo();
  const { data: operationTypes } = useOperationTypesFlat();
  const isEdit = useSelector(selectStageFormState) === 'edit';

  const dialogProps = {
    isEdit,
    entityType: 'operation',
    dto: operationFormSchema,
    valuesSelector: selectStageFormValues,
    stateSelector: selectStageFormState,
    stateDispatch: setStageFormState,
    valuesEmptyDispatch: setStageFormValuesEmpty,
    valuesDtoDispatch: setStageFormValuesFromDto,
    updateHook: useUpdateOperation,
    createHook: useCreateOperation,
    deleteHook: useDeleteOperation,
    FieldsArray: StageFormFieldArray,
    customizeDefaultValues: (values: OperationFormDto) => ({
      ...values,
      class: 'stage',
      approveToId: values?.approveToId || approvers?.[0]?.value,
    }),
    customizeCreateValues: (values: OperationFormDto) => ({
      ...values,
      class: 'stage',
    }),
    customizeUpdateValues: (values: OperationFormDto) => ({
      ...values,
      class: 'stage',
      // controlFromId: null,
      // controlToId: null,
      approveToId:
        operationTypes?.find((operation) => {
          return operation.id === values.typeId;
        })?.autoApprove || values.approveToId === 0
          ? null
          : values.approveToId,
    }),
    // displayedElement: <EditedStageDisplayElement />,
    dialogWidth: '600px',
    className,
    createTitle: 'Добавить операцию',
    editTitle: 'Изменить операцию',
    createDescription: 'Внесите данные для создания операции',
    editDescription: 'Внесите изменения в запись об операции',
  } as unknown as FormDialogProps<OperationFormDto>;

  return <FormDialog {...dialogProps} />;
};

export { CreateStageDialog };
