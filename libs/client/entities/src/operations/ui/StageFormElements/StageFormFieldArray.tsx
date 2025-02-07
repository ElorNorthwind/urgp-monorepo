import {
  cn,
  guestUser,
  selectCurrentUser,
  useAuth,
  useUserAbility,
} from '@urgp/client/shared';

import {
  DateFormField,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { ControlStageFormValuesDto } from '@urgp/shared/entities';
import { UseFormReturn } from 'react-hook-form';
import { Fragment } from 'react/jsx-runtime';
import {
  OperationTypeSelector,
  useCurrentUserApprovers,
  useOperationTypesFlat,
} from '../../../classificators';
import { useCaseById } from '../../../cases';
import { useSelector } from 'react-redux';

type StageFormFieldArrayProps = {
  form: UseFormReturn<ControlStageFormValuesDto, any, undefined>;
  isEdit: boolean;
  popoverMinWidth?: string;
};

const StageFormFieldArray = ({
  form,
  isEdit,
  popoverMinWidth,
}: StageFormFieldArrayProps): JSX.Element | null => {
  const { data: operationTypes, isLoading: isOperationTypesLoading } =
    useOperationTypesFlat();
  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApprovers();

  // Запрет на решение дел с контролем высокого уровня
  const { data: controlCase, isLoading: isStageLoading } = useCaseById(
    form.watch('caseId') || 0,
    { skip: !form.watch('caseId') || form.watch('caseId') === 0 },
  );
  const user = useAuth();
  const i = useUserAbility();
  const filteredApprovers = controlCase
    ? approvers?.operations.filter((approver) => {
        return approver.value !== user.id || i.can('resolve', controlCase);
      })
    : approvers?.operations;

  const watchType = form.watch('typeId');

  return (
    <Fragment>
      <OperationTypeSelector
        form={form}
        fieldName={'typeId'}
        popoverMinWidth={popoverMinWidth}
        disabled={isEdit}
      />
      <div className="flex w-full flex-row gap-4">
        <DateFormField
          form={form}
          fieldName={'doneDate'}
          label="Дата"
          placeholder="Дата документа"
          className="flex-shrink-0"
          dirtyIndicator={isEdit}
        />
        <InputFormField
          form={form}
          fieldName={'num'}
          label="Номер"
          placeholder="Номер документа"
          className="flex-grow"
          dirtyIndicator={isEdit}
        />
      </div>
      <TextAreaFormField
        form={form}
        fieldName={'description'}
        label="Описание"
        placeholder="Описание операции"
        dirtyIndicator={isEdit}
      />
      <SelectFormField
        form={form}
        fieldName={'approverId'}
        options={filteredApprovers}
        isLoading={
          isApproversLoading || isOperationTypesLoading || isStageLoading
        }
        label="Согласующий"
        placeholder="Выбор согласующего"
        popoverMinWidth={popoverMinWidth}
        dirtyIndicator={isEdit}
        className={cn(
          operationTypes?.find((operation) => {
            return operation.id === watchType;
          })?.autoApprove && 'hidden',
        )}
      />
    </Fragment>
  );
};

export { StageFormFieldArray };
