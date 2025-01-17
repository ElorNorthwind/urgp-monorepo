import {
  Button,
  cn,
  Form,
  selectCurrentUser,
  selectStageFormState,
  selectStageFormValues,
  setStageFormState,
  setStageFormValuesEmpty,
  Skeleton,
} from '@urgp/client/shared';

import { UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import {
  useCreateControlStage,
  useStages,
  useUpdateControlStage,
} from '../../api/operationsApi';
import {
  OperationTypeSelector,
  useCurrentUserApprovers,
  useOperationTypesFlat,
} from '../../../classificators';
import {
  DateFormField,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { StageHistoryItem } from '../StagesList/StageHistoryItem';
import { useDispatch, useSelector } from 'react-redux';
import {
  ControlStageFormValuesDto,
  ControlStageUpdateDto,
} from '@urgp/shared/entities';
import { Fragment } from 'react/jsx-runtime';

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
        options={approvers?.operations}
        isLoading={isApproversLoading || isOperationTypesLoading}
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
