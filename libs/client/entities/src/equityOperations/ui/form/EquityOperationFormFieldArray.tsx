import { cn, useAuth } from '@urgp/client/shared';
import {
  DateFormField,
  FieldsArrayProps,
  InputFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { CreateEquityOperationDto } from '@urgp/shared/entities';
import { Fragment } from 'react/jsx-runtime';

import { EquityOperationTypeSelector } from '../selectors/EquityOperationTypeSelector';
import { useEquityOperationTypes } from '../../../equityClassificators';

const EquityOperationFieldArray = ({
  form,
  isEdit,
  popoverMinWidth,
}: FieldsArrayProps<CreateEquityOperationDto>): JSX.Element | null => {
  const user = useAuth();
  const watchType = form.watch('typeId');
  const { data, isLoading, isFetching } = useEquityOperationTypes();
  const fields = data?.[0]?.items?.find((v) => v.value === watchType)?.tags ?? [
    'date',
    'notes',
    'number',
  ];

  if (!fields) return null;

  // const watchApproveTo = form.watch('approveToId');
  // const watchExternal = form.watch('externalCases', []);

  // useEffect(() => {
  //   if (watchExternal.some((e) => e.system === 'EDO')) {
  //     form.setValue(
  //       'dueDate',
  //       addBusinessDays(startOfToday(), 5).toISOString(),
  //     );
  //   } else {
  //     form.setValue('dueDate', GET_DEFAULT_CONTROL_DUE_DATE());
  //   }
  // }, [watchExternal.some((e) => e.system === 'EDO'), watchApproveTo]);

  // const isApproved = form.getValues('approveStatus') === 'approved';
  // const { data: approvers, isLoading: isApproversLoading } =
  // useCurrentUserApproveTo();

  return (
    <Fragment>
      <EquityOperationTypeSelector
        form={form}
        label="Тип"
        placeholder="Тип операции"
        fieldName="typeId"
        popoverMinWidth={popoverMinWidth}
        dirtyIndicator={isEdit}
      />
      <DateFormField
        form={form}
        fieldName={'date'}
        label="Дата"
        placeholder="Дата"
        className={cn('flex-shrink-0', !fields?.includes('date') && 'hidden')}
        dirtyIndicator={isEdit}
      />
      <InputFormField
        form={form}
        fieldName={'number'}
        label="Номер"
        placeholder="Номер"
        className={cn('flex-grow', !fields?.includes('number') && 'hidden')}
        dirtyIndicator={isEdit}
      />
      <TextAreaFormField
        form={form}
        fieldName={'notes'}
        label="Описание"
        placeholder="Описание"
        className={cn('flex-grow', !fields?.includes('notes') && 'hidden')}
        dirtyIndicator={isEdit}
      />
      <InputFormField
        form={form}
        fieldName={'source'}
        label="Источник данных"
        placeholder="Источнк"
        className={cn('flex-grow', !fields?.includes('source') && 'hidden')}
        dirtyIndicator={isEdit}
      />
      <InputFormField
        form={form}
        fieldName={'fio'}
        label="Кредитор"
        placeholder="ФИО кредитора"
        className={cn('flex-grow', !fields?.includes('fio') && 'hidden')}
        dirtyIndicator={isEdit}
      />
      <InputFormField
        form={form}
        fieldName={'result'}
        label="Итог (переделай меня!)"
        placeholder="Итог (переделай меня!)"
        className={cn('flex-grow', !fields?.includes('result') && 'hidden')}
        dirtyIndicator={isEdit}
      />

      {/* <CaseTypeSelector
        form={form}
        label="Тип"
        placeholder="Тип заявки"
        fieldName="typeId"
        popoverMinWidth={popoverMinWidth}
        dirtyIndicator={isEdit}
      />
      <div className="flex w-full flex-row items-end gap-2">
        <DirectionTypeSelector
          form={form}
          className={cn('flex-grow', manualControlTo ? 'hidden' : '')}
          label="Направления"
          placeholder="Направления работы"
          fieldName="directionIds"
          dirtyIndicator={isEdit}
          popoverMinWidth={canSkipDirections ? '31.5rem' : popoverMinWidth}
        />
        <ManualControlToSelector
          form={form}
          className={cn('flex-grow', manualControlTo ? '' : 'hidden')}
          label="Исполнитель"
          placeholder="Ответственный исполнитель"
          fieldName="manualControlToIds"
          dirtyIndicator={isEdit}
          popoverMinWidth={canSkipDirections ? '31.5rem' : popoverMinWidth}
        />
        {canSkipDirections && (
          <Tooltip>
            <TooltipTrigger>
              <Button
                role="button"
                variant="outline"
                size="icon"
                className="size-10 p-1"
                onClick={(e) => {
                  e.preventDefault();
                  // if (manualControlTo && !isEdit)
                  //   form.setValue('directionIds', []);
                  // if (!manualControlTo)
                  //   form.setValue('manualControlToIds', []);
                  setManualControlTo((prev) => !prev);
                }}
              >
                {manualControlTo ? <SquareAsterisk /> : <SquareUserRound />}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              {manualControlTo ? 'Выбрать направления' : 'Выбрать исполнителя'}
            </TooltipContent>
          </Tooltip>
        )}
      </div>
      <ProblemSelector
        form={form}
        fieldName="connectionsToIds"
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
          disabledDays={(date) => isBefore(date, endOfYesterday())}
          disabled={isEdit || user?.id !== watchApproveTo}
          className={cn(
            'flex-shrink-0',
            user?.id !== watchApproveTo && 'hidden',
          )}
        />
      </div> */}
    </Fragment>
  );
};

export { EquityOperationFieldArray };
