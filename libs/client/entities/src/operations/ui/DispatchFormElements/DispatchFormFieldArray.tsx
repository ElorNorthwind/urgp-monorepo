import { cn, selectDispatchFormValues } from '@urgp/client/shared';
import { DispatchFormValuesDto } from '@urgp/shared/entities';
import { UseFormReturn } from 'react-hook-form';

import { useControlExecutors } from '@urgp/client/entities';
import {
  DateFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { endOfYesterday, isBefore } from 'date-fns';
import { Fragment, useEffect, useMemo, useState } from 'react';
import { useSelector } from 'react-redux';

type DispatchFormFieldArrayProps = {
  form: UseFormReturn<DispatchFormValuesDto, any, undefined>;
  isEdit: boolean;
  popoverMinWidth?: string;
};

const DispatchFormFieldArray = ({
  form,
  isEdit,
  popoverMinWidth,
}: DispatchFormFieldArrayProps): JSX.Element | null => {
  const { data: executors, isLoading: isExecutorsLoading } =
    useControlExecutors();
  const defaultValues = useSelector(selectDispatchFormValues);

  const watchDueDate = form.watch('dueDate');
  const controllerList = useMemo(() => {
    return [
      { value: 'author', label: 'Оставить контроль за собой' },
      { value: 'executor', label: 'Оставить на контроле исполнителя' },
    ];
  }, [executors]);

  const [dateChanged, setDateChanged] = useState(false);
  useEffect(() => {
    if (!isEdit) return;
    const needDescription =
      new Date(watchDueDate || 0).setHours(0, 0, 0, 0) !==
      new Date(defaultValues?.dueDate || 0).setHours(0, 0, 0, 0);
    setDateChanged(needDescription);
    form.setValue(
      'dateDescription',
      needDescription ? '' : 'Без переноса срока',
    );
  }, [watchDueDate, isEdit]);

  return (
    <Fragment>
      <div className="flex w-full flex-row gap-2">
        <SelectFormField
          form={form}
          isLoading={isExecutorsLoading}
          fieldName={'executorId'}
          options={executors}
          label="Исполнитель"
          placeholder="Выбор адресата поручения"
          popoverMinWidth={popoverMinWidth}
          valueType="number"
          className="flex-grow"
          dirtyIndicator={!!isEdit}
        />
        <DateFormField
          form={form}
          fieldName={'dueDate'}
          label="Срок решения"
          placeholder="Контрольный срок"
          className={cn('flex-shrink-0')}
          dirtyIndicator={!!isEdit}
          disabledDays={(date) => isBefore(date, endOfYesterday())}
        />
      </div>
      <SelectFormField
        form={form}
        fieldName={'controller'}
        options={controllerList}
        label="Контроль"
        placeholder="За кем останется контроль"
        popoverMinWidth={popoverMinWidth}
        valueType="string"
        className={cn('flex-grow')}
        disabled={!!isEdit}
      />
      <TextAreaFormField
        form={form}
        fieldName={'description'}
        label="Комментарий"
        placeholder="Комментарий к поручению"
        dirtyIndicator={!!isEdit}
      />
      <TextAreaFormField
        form={form}
        fieldName={'dateDescription'}
        label="Причина переноса срока"
        placeholder="Комментарий к изменению срока поручения"
        className={cn(dateChanged ? '' : 'hidden')}
      />
    </Fragment>
  );
};

export { DispatchFormFieldArray };
