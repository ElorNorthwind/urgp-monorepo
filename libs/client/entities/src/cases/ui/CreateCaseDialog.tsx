import {
  selectCaseFormState,
  selectCaseFormValues,
  setCaseFormState,
  setCaseFormValuesEmpty,
  setCaseFormValuesFromDto,
} from '@urgp/client/shared';
import { useCurrentUserApprovers } from '../../classificators';
import { caseFormValuesDto, CaseFormValuesDto } from '@urgp/shared/entities';

import { useCreateCase, useDeleteCase, useUpdateCase } from '../api/casesApi';
import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
import { CaseFormFieldArray } from './CaseFormElements/CaseFormFieldArray';

type CreateCaseDialogProps = {
  className?: string;
};

const CreateCaseDialog = ({
  className,
}: CreateCaseDialogProps): JSX.Element | null => {
  const { data: approvers } = useCurrentUserApprovers();

  const dialogProps = {
    entityType: 'case',
    dto: caseFormValuesDto,
    valuesSelector: selectCaseFormValues,
    stateSelector: selectCaseFormState,
    stateDispatch: setCaseFormState,
    valuesEmptyDispatch: setCaseFormValuesEmpty,
    valuesDtoDispatch: setCaseFormValuesFromDto,
    updateHook: useUpdateCase,
    createHook: useCreateCase,
    deleteHook: useDeleteCase,
    FieldsArray: CaseFormFieldArray,
    customizeDefaultValues: (values: CaseFormValuesDto) => ({
      ...values,
      class: 'control-incident',
      approverId: values?.approverId || approvers?.cases?.[0]?.value,
    }),
    customizeCreateValues: (values: CaseFormValuesDto) => ({
      ...values,
      class: 'control-incident',
    }),
    customizeUpdateValues: (values: CaseFormValuesDto) => ({
      ...values,
      class: 'control-incident',
    }),
    dialogWidth: '600px',
    className,
    createTitle: 'Добавить дело',
    editTitle: 'Изменить дело',
    createDescription: 'Внесите данные с информации о происшествии',
    editDescription: 'Внесите изменения в запись о происшествии',
  } as unknown as FormDialogProps<CaseFormValuesDto>;

  return <FormDialog {...dialogProps} />;
};

export { CreateCaseDialog };
