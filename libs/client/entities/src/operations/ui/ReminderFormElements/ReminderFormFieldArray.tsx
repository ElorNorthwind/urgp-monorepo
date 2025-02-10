import { cn } from '@urgp/client/shared';
import { UseFormReturn } from 'react-hook-form';

import { DateFormField, TextAreaFormField } from '@urgp/client/widgets';
import { endOfYesterday, isBefore } from 'date-fns';
import { Fragment, useEffect, useRef } from 'react';
import { EditedReminderDisplayElement } from './EditedReminderDisplayElement';
import { OperationFormDto } from '@urgp/shared/entities';

type ReminderFormFieldArrayProps = {
  form: UseFormReturn<OperationFormDto, any, undefined>;
  isEdit: boolean;
};

const ReminderFormFieldArray = ({
  form,
  isEdit,
}: ReminderFormFieldArrayProps): JSX.Element | null => {
  return (
    <Fragment>
      <div className="flex w-full flex-row items-end gap-2">
        <DateFormField
          form={form}
          fieldName={'dueDate'}
          label="Дата напоминания"
          placeholder="Напомнить в срок"
          className={cn('ml-autoflex-shrink-0')}
          dirtyIndicator={!!isEdit}
          disabledDays={(date) => isBefore(date, endOfYesterday())}
        />
        <EditedReminderDisplayElement />
      </div>
      <TextAreaFormField
        form={form}
        fieldName={'notes'}
        label="Комментарий"
        placeholder="Комментарий к напоминанию"
        dirtyIndicator={!!isEdit}
      />
    </Fragment>
  );
};

export { ReminderFormFieldArray };
