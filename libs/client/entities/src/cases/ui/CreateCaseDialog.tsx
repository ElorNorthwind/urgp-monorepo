import {
  selectCaseFormState,
  selectCaseFormValues,
  setCaseFormState,
  setCaseFormValuesEmpty,
  setCaseFormValuesFromDto,
  useUserAbility,
} from '@urgp/client/shared';

import { useCreateCase, useDeleteCase, useUpdateCase } from '../api/casesApi';
import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
import { CaseFormFieldArray } from './CaseFormElements/CaseFormFieldArray';
import { useSelector } from 'react-redux';
import { useCurrentUserApproveTo } from '../../classificators';
import { CaseFormDto, caseFormSchema } from '@urgp/shared/entities';

type CreateCaseDialogProps = {
  className?: string;
};

const CreateCaseDialog = ({
  className,
}: CreateCaseDialogProps): JSX.Element | null => {
  const { data: approveTo } = useCurrentUserApproveTo();
  const isEdit = useSelector(selectCaseFormState) === 'edit';
  const i = useUserAbility();
  const values = useSelector(selectCaseFormValues);
  const canDelete = i.can('delete', values);

  const dialogProps = {
    isEdit,
    entityType: 'case',
    dto: caseFormSchema,
    valuesSelector: selectCaseFormValues,
    stateSelector: selectCaseFormState,
    stateDispatch: setCaseFormState,
    valuesEmptyDispatch: setCaseFormValuesEmpty,
    valuesDtoDispatch: setCaseFormValuesFromDto,
    updateHook: useUpdateCase,
    createHook: useCreateCase,
    deleteHook: useDeleteCase,
    FieldsArray: CaseFormFieldArray,
    customizeDefaultValues: (values: CaseFormDto) => ({
      ...values,
      class: 'control-incident',
      approveToId: values?.approveToId || approveTo?.[0]?.value,
    }),
    customizeCreateValues: (values: CaseFormDto) => ({
      ...values,
      class: 'control-incident',
    }),
    customizeUpdateValues: (values: CaseFormDto) => ({
      ...values,
      class: 'control-incident',
    }),
    dialogWidth: '600px',
    className,
    createTitle: 'Добавить дело',
    editTitle: 'Изменить дело',
    createDescription: 'Внесите данные с информации о происшествии',
    editDescription: 'Внесите изменения в запись о происшествии',
    allowDelete: canDelete && isEdit,
  } as unknown as FormDialogProps<CaseFormDto>;

  return <FormDialog {...dialogProps} />;
};

export { CreateCaseDialog };
