import { cn, useAuth, useUserAbility } from '@urgp/client/shared';

import {
  DateFormField,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { UseFormReturn } from 'react-hook-form';
import { Fragment } from 'react/jsx-runtime';
import {
  OperationTypeSelector,
  useCurrentUserApproveTo,
  useOperationTypesFlat,
} from '../../../classificators';
import { useCaseById } from '../../../cases';
import { OperationFormDto } from '@urgp/shared/entities';

type StageFormFieldArrayProps = {
  form: UseFormReturn<OperationFormDto, any, undefined>;
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
  const { data: approveToList, isLoading: isApproversLoading } =
    useCurrentUserApproveTo();

  // Запрет на решение дел с контролем высокого уровня
  const { data: controlCase, isLoading: isStageLoading } = useCaseById(
    form.watch('caseId') || 0,
    { skip: !form.watch('caseId') || form.watch('caseId') === 0 },
  );
  const user = useAuth();
  const i = useUserAbility();
  const filteredApprovers = controlCase
    ? approveToList?.filter((approveTo) => {
        return approveTo.value !== user.id || i.can('resolve', controlCase);
      })
    : approveToList;

  // const filteredApproveTo = approveToList?.filter((approver) => {
  //   if (approver.value === 0) return true;
  //   if (
  //     controlCase &&
  //     approver.value !== user?.id &&
  //     i.cannot('resolve', controlCase)
  //   )
  //     return false;
  //   if (
  //     form.getValues('approveToId') === approver?.value &&
  //     approver.value !== user?.id
  //   )
  //     return false;
  //   return true;
  // });

  const watchType = form.watch('typeId');

  return (
    <Fragment>
      <OperationTypeSelector
        form={form}
        fieldName={'typeId'}
        popoverMinWidth={popoverMinWidth}
        // disabled={isEdit}
        filterData={(data) => {
          if (!isEdit) return data;
          return data.filter((group) => {
            return group.items.some((item) => item.value === watchType);
          });
        }}
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
          fieldName={'title'}
          label="Номер"
          placeholder="Номер документа"
          className="flex-grow"
          dirtyIndicator={isEdit}
        />
      </div>
      <TextAreaFormField
        form={form}
        fieldName={'notes'}
        label="Описание"
        placeholder="Описание операции"
        dirtyIndicator={isEdit}
      />
      <SelectFormField
        form={form}
        fieldName={'approveToId'}
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
