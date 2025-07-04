import {
  selectEquityOperationFormState,
  selectEquityOperationFormValues,
  setOperationFormState,
  setOperationFormValuesEmpty,
  setOperationFormValuesFromDto,
  useEquityAbility,
} from '@urgp/client/shared';

import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
// import { CaseFormFieldArray } from './CaseFormElements/CaseFormFieldArray';
import {
  CreateEquityOperationDto,
  createEquityOperationSchema,
} from '@urgp/shared/entities';
import { useSelector } from 'react-redux';
import { EquityOperationFieldArray } from './EquityOperationFormFieldArray';
import {
  useCreateEquityOperation,
  useDeleteEquityOperation,
  useUpdateEquityOperation,
} from '../../api/equityOperationsApi';

type CreateEquityOperationDialogProps = {
  className?: string;
};

const CreateEquityOperationDialog = ({
  className,
}: CreateEquityOperationDialogProps): JSX.Element | null => {
  // const { data: approveTo } = useCurrentUserApproveTo();
  const isEdit = useSelector(selectEquityOperationFormState) === 'edit';
  const i = useEquityAbility();
  const values = useSelector(selectEquityOperationFormValues);
  const canDelete = i.can('delete', values);

  const dialogProps = {
    isEdit,
    entityType: 'operation',
    dto: createEquityOperationSchema,
    valuesSelector: selectEquityOperationFormValues,
    stateSelector: selectEquityOperationFormState,
    stateDispatch: setOperationFormState,
    valuesEmptyDispatch: setOperationFormValuesEmpty,
    valuesDtoDispatch: setOperationFormValuesFromDto,
    updateHook: useUpdateEquityOperation,
    createHook: useCreateEquityOperation,
    deleteHook: useDeleteEquityOperation,
    FieldsArray: EquityOperationFieldArray,
    customizeDefaultValues: (values: CreateEquityOperationDto) => ({
      ...values,
      class: 'operation',
    }),
    customizeCreateValues: (values: CreateEquityOperationDto) => ({
      ...values,
      class: 'operation',
    }),
    customizeUpdateValues: (values: CreateEquityOperationDto) => ({
      ...values,
      class: 'operation',
    }),
    dialogWidth: '600px',
    className,
    createTitle: 'Добавить операцию',
    editTitle: 'Изменить операцию',
    createDescription: 'Внесите данные о новой операции',
    editDescription: 'Измените существующую операцию',
    allowDelete: canDelete && isEdit,
  } as unknown as FormDialogProps<CreateEquityOperationDto>;

  return <FormDialog {...dialogProps} />;
};

export { CreateEquityOperationDialog };
