import { cn, selectCurrentUser } from '@urgp/client/shared';
import { CaseFormValuesDto } from '@urgp/shared/entities';
import {
  DateFormField,
  FieldsArrayProps,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { useSelector } from 'react-redux';
import {
  CaseTypeSelector,
  DirectionTypeSelector,
  useCurrentUserApprovers,
} from '../../../../classificators';
import { ExternalCaseFieldArray } from './ExternalCaseFieldArray';
import { Fragment } from 'react/jsx-runtime';

const CreateCaseForm = ({
  form,
  isEdit,
  popoverMinWidth,
}: FieldsArrayProps<CaseFormValuesDto>): JSX.Element | null => {
  const user = useSelector(selectCurrentUser);

  const watchApprover = form.watch('approverId');
  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApprovers();

  return (
    <Fragment>
      <CaseTypeSelector
        form={form}
        label="Тип"
        placeholder="Тип заявки"
        fieldName="typeId"
        popoverMinWidth={popoverMinWidth}
        dirtyIndicator={isEdit}
      />

      <DirectionTypeSelector
        form={form}
        label="Направления"
        placeholder="Направления работы"
        fieldName="directionIds"
        dirtyIndicator={isEdit}
      />
      <ExternalCaseFieldArray form={form} fieldArrayName="externalCases" />
      <div className="flex w-full flex-row gap-2">
        <InputFormField
          form={form}
          fieldName={'fio'}
          label="Заявитель"
          placeholder="ФИО заявителя"
          className="flex-grow"
          dirtyIndicator={isEdit}
        />
        <InputFormField
          form={form}
          fieldName={'adress'}
          label="Адрес"
          placeholder="Адрес заявителя"
          className="flex-grow"
          dirtyIndicator={isEdit}
        />
      </div>
      <TextAreaFormField
        form={form}
        fieldName={'description'}
        label="Описание"
        placeholder="Описание проблемы"
        dirtyIndicator={isEdit}
      />
      <div className="flex w-full flex-row gap-2">
        <SelectFormField
          form={form}
          isLoading={isApproversLoading}
          fieldName={'approverId'}
          options={approvers?.operations}
          label="Согласующий"
          placeholder="Выбор согласующего"
          popoverMinWidth={popoverMinWidth}
          dirtyIndicator={isEdit}
          valueType="number"
          className="flex-grow"
        />
        <DateFormField
          form={form}
          fieldName={'dueDate'}
          label="Срок решения"
          placeholder="Контрольный срок"
          disabled={isEdit || user?.id !== watchApprover}
          className={cn(
            'flex-shrink-0',
            (user?.id !== watchApprover || user?.id !== watchApprover) &&
              'hidden',
          )}
        />
      </div>
    </Fragment>
  );
};

export { CreateCaseForm };
