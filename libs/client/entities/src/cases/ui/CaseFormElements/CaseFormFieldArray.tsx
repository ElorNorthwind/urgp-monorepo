import { cn, selectCurrentUser } from '@urgp/client/shared';
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
  useGetCurrentUserApproveto,
} from '../../../classificators';
import { ExternalCaseFieldArray } from './ExternalCaseFieldArray';
import { Fragment } from 'react/jsx-runtime';
import { CaseFormDto } from '@urgp/shared/entities';

const CaseFormFieldArray = ({
  form,
  isEdit,
  popoverMinWidth,
}: FieldsArrayProps<CaseFormDto>): JSX.Element | null => {
  const user = useSelector(selectCurrentUser);

  const watchApproveTo = form.watch('approveToId');
  const { data: approvers, isLoading: isApproversLoading } =
    useGetCurrentUserApproveto();

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
        popoverMinWidth={popoverMinWidth}
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
          options={approvers}
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
          disabled={isEdit || user?.id !== watchApproveTo}
          className={cn(
            'flex-shrink-0',
            (user?.id !== watchApproveTo || user?.id !== watchApproveTo) &&
              'hidden',
          )}
        />
      </div>
    </Fragment>
  );
};

export { CaseFormFieldArray };
