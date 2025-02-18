import {
  selectCaseFormState,
  selectCaseFormValues,
  selectProblemFormState,
  selectProblemFormValues,
  setCaseFormState,
  setCaseFormValuesEmpty,
  setCaseFormValuesFromDto,
  setProblemFormState,
  setProblemFormValuesEmpty,
  setProblemFormValuesFromDto,
  useUserAbility,
} from '@urgp/client/shared';

import { useCreateCase, useDeleteCase, useUpdateCase } from '../api/casesApi';
import { FormDialog, FormDialogProps } from '@urgp/client/widgets';
import { CaseFormFieldArray } from './CaseFormElements/CaseFormFieldArray';
import { useSelector } from 'react-redux';
import { useCurrentUserApproveTo } from '../../classificators';
import {
  CaseClasses,
  CaseFormDto,
  caseFormSchema,
} from '@urgp/shared/entities';
import { ProblemFormFieldArray } from './ProblemFormElements/ProblemFormFieldArray';

type CreateProblemDialogProps = {
  className?: string;
};

const CreateProblemDialog = ({
  className,
}: CreateProblemDialogProps): JSX.Element | null => {
  const { data: approveTo } = useCurrentUserApproveTo();
  const isEdit = useSelector(selectProblemFormState) === 'edit';
  const i = useUserAbility();
  const values = useSelector(selectProblemFormValues);
  const canDelete = i.can('delete', values);

  const dialogProps = {
    isEdit,
    entityType: 'case',
    dto: caseFormSchema,
    valuesSelector: selectProblemFormValues,
    stateSelector: selectProblemFormState,
    stateDispatch: setProblemFormState,
    valuesEmptyDispatch: setProblemFormValuesEmpty,
    valuesDtoDispatch: setProblemFormValuesFromDto,
    updateHook: useUpdateCase,
    createHook: useCreateCase,
    deleteHook: useDeleteCase,
    FieldsArray: ProblemFormFieldArray,
    customizeDefaultValues: (values: CaseFormDto) => ({
      ...values,
      class: CaseClasses.problem,
      typeId: 5,
      approveToId: values?.approveToId || approveTo?.[0]?.value,
    }),
    customizeCreateValues: (values: CaseFormDto) => ({
      ...values,
      class: CaseClasses.problem,
      typeId: 5,
    }),
    customizeUpdateValues: (values: CaseFormDto) => ({
      ...values,
      class: CaseClasses.problem,
      typeId: 5,
    }),
    dialogWidth: '600px',
    className,
    createTitle: 'Добавить системную проблему',
    editTitle: 'Изменить системную проблему',
    createDescription: 'Внесите данные с информации о проблеме',
    editDescription: 'Внесите изменения в запись о проблеме',
    allowDelete: canDelete && isEdit,
  } as unknown as FormDialogProps<CaseFormDto>;

  return <FormDialog {...dialogProps} />;
};

export { CreateProblemDialog };
