import { cn, selectCurrentUser, useUserAbility } from '@urgp/client/shared';
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
  useCurrentUserApproveTo,
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
  const i = useUserAbility();

  const watchApproveTo = form.watch('approveToId');
  // const isApproved = form.getValues('approveStatus') === 'approved';
  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApproveTo();

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
          fieldName={'title'}
          label="Заявитель"
          placeholder="ФИО заявителя"
          className="flex-grow"
          dirtyIndicator={isEdit}
        />
        <InputFormField
          form={form}
          fieldName={'extra'}
          label="Адрес"
          placeholder="Адрес заявителя"
          className="flex-grow"
          dirtyIndicator={isEdit}
        />
      </div>
      <TextAreaFormField
        form={form}
        fieldName={'notes'}
        label="Описание"
        placeholder="Описание проблемы"
        dirtyIndicator={isEdit}
      />
      <div className={cn('flex w-full flex-row gap-2', isEdit && 'hidden')}>
        <SelectFormField
          form={form}
          isLoading={isApproversLoading}
          fieldName={'approveToId'}
          options={approvers}
          label="Согласующий"
          placeholder="Выбор согласующего"
          popoverMinWidth={popoverMinWidth}
          dirtyIndicator={isEdit}
          disabled={isEdit}
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
            user?.id !== watchApproveTo && 'hidden',
          )}
        />
      </div>
    </Fragment>
  );
};

export { CaseFormFieldArray };
