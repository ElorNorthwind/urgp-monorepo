import {
  selectStageFormState,
  selectStageFormValues,
  setStageFormState,
  setStageFormValuesEmpty,
  setStageFormValuesFromDto,
} from '@urgp/client/shared';
import {
  useCurrentUserApprovers,
  useOperationTypesFlat,
} from '../../classificators';
import {
  ControlStageFormValuesDto,
  controlStageFormValuesDto,
} from '@urgp/shared/entities';

import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
import {
  useCreateControlStage,
  useDeleteOperation,
  useUpdateControlStage,
} from '../api/operationsApi';
import { StageFormFieldArray } from './StageFormElements/StageFormFieldArray';
import { useSelector } from 'react-redux';
import { EditedStageDusplayElement } from './StageFormElements/EditedStageDisplayElement';

type CreateStageDialogProps = {
  className?: string;
};

const CreateStageDialog = ({
  className,
}: CreateStageDialogProps): JSX.Element | null => {
  const { data: approvers } = useCurrentUserApprovers();
  const { data: operationTypes } = useOperationTypesFlat();
  const isEdit = useSelector(selectStageFormState) === 'edit';

  const dialogProps = {
    isEdit,
    entityType: 'operation',
    dto: controlStageFormValuesDto,
    valuesSelector: selectStageFormValues,
    stateSelector: selectStageFormState,
    stateDispatch: setStageFormState,
    valuesEmptyDispatch: setStageFormValuesEmpty,
    valuesDtoDispatch: setStageFormValuesFromDto,
    updateHook: useUpdateControlStage,
    createHook: useCreateControlStage,
    deleteHook: useDeleteOperation,
    FieldsArray: StageFormFieldArray,
    customizeDefaultValues: (values: ControlStageFormValuesDto) => ({
      ...values,
      class: 'stage',
      approverId: values?.approverId || approvers?.operations?.[0]?.value,
    }),
    customizeCreateValues: (values: ControlStageFormValuesDto) => ({
      ...values,
      class: 'stage',
    }),
    customizeUpdateValues: (values: ControlStageFormValuesDto) => ({
      ...values,
      class: 'stage',
      approverId: operationTypes?.find((operation) => {
        return operation.id === values.typeId;
      })?.autoApprove
        ? null
        : values.approverId,
    }),
    displayedElement: <EditedStageDusplayElement />,
    dialogWidth: '600px',
    className,
    createTitle: 'Добавить операцию',
    editTitle: 'Изменить операцию',
    createDescription: 'Внесите данные для создания операции',
    editDescription: 'Внесите изменения в запись об операции',
  } as unknown as FormDialogProps<ControlStageFormValuesDto>;

  return <FormDialog {...dialogProps} />;
};

export { CreateStageDialog };
