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
  DirectionTypeSelector,
  IncidentSelector,
  useCurrentUserApproveTo,
} from '../../../classificators';
import { Fragment } from 'react/jsx-runtime';
import { CaseFormDto } from '@urgp/shared/entities';

const ProblemFormFieldArray = ({
  form,
  isEdit,
  popoverMinWidth,
}: FieldsArrayProps<CaseFormDto>): JSX.Element | null => {
  const user = useSelector(selectCurrentUser);
  const i = useUserAbility();

  const watchApproveTo = form.watch('approveToId');
  const { data: approvers, isLoading: isApproversLoading } =
    useCurrentUserApproveTo();

  return (
    <Fragment>
      <InputFormField
        form={form}
        fieldName={'title'}
        label="Название (кратко)"
        placeholder="Краткая название проблемы"
        dirtyIndicator={isEdit}
      />
      <TextAreaFormField
        form={form}
        fieldName={'notes'}
        label="Описание"
        placeholder="Подробное описание проблемы"
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
      <IncidentSelector
        form={form}
        fieldName="connectionsFromIds"
        dirtyIndicator={isEdit}
        popoverMinWidth={popoverMinWidth}
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

export { ProblemFormFieldArray };
