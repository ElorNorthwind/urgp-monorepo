import { cn, useAuth } from '@urgp/client/shared';
import {
  DateFormField,
  FieldsArrayProps,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import {
  CreateEquityOperationDto,
  NestedClassificatorInfo,
} from '@urgp/shared/entities';
import { Fragment } from 'react/jsx-runtime';

import { EquityOperationTypeSelector } from '../selectors/EquityOperationTypeSelector';
import { useEquityOperationTypes } from '../../../equityClassificators';
import { useEffect, useMemo } from 'react';

const EquityOperationFieldArray = ({
  form,
  isEdit,
  popoverMinWidth,
}: FieldsArrayProps<CreateEquityOperationDto>): JSX.Element | null => {
  const user = useAuth();
  const watchType = form.watch('typeId');
  const { data, isLoading, isFetching } = useEquityOperationTypes();

  const flatItems = useMemo(
    () =>
      data?.reduce(
        (acc, cur) => {
          return [...acc, ...cur.items];
        },
        [] as NestedClassificatorInfo['items'],
      ) ?? [],
    [data],
  );

  const fields = flatItems.find((v) => v.value === watchType)?.fields ?? [
    'date',
    'notes',
    'number',
  ];

  useEffect(() => {
    if (form.getValues('result') !== 'ок' && form.getValues('result') !== '')
      return;
    if (fields?.includes('result')) {
      form.setValue('result', '');
    } else {
      form.setValue('result', 'ок');
    }
  }, [watchType]);

  const resultOptions = useMemo(() => {
    if ([5].includes(watchType))
      return [
        { label: 'документы получены', value: 'документы получены' },
        { label: 'документы не получены', value: 'документы не получены' },
      ];
    if ([7, 14, 15].includes(watchType))
      return [
        { label: 'положительное', value: 'положительное' },
        { label: 'условно-положительное', value: 'условно-положительное' },
        { label: 'отрицательное', value: 'отрицательное' },
      ];
    if ([20].includes(watchType))
      return [
        { label: 'полный пакет', value: 'полный пакет' },
        { label: 'пакет с замечаниями', value: 'пакет с замечаниями' },
      ];
    if ([22].includes(watchType))
      return [
        { label: 'положительное', value: 'положительное' },
        { label: 'отрицательное', value: 'отрицательное' },
      ];

    return [
      { label: 'ок', value: 'ок' },
      { label: 'не ок', value: 'не ок' },
    ];
  }, [watchType]);

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

  if (!fields) return null;

  return (
    <Fragment>
      <EquityOperationTypeSelector
        form={form}
        label="Тип"
        placeholder="Тип операции"
        fieldName="typeId"
        popoverMinWidth={popoverMinWidth}
        commandListClassName="max-h-[25rem]"
        dirtyIndicator={isEdit}
      />
      <InputFormField
        form={form}
        fieldName={'fio'}
        label="Заявитель"
        placeholder="ФИО заявителя"
        className={cn('flex-grow', !fields?.includes('fio') && 'hidden')}
        dirtyIndicator={isEdit}
      />
      <div className="flex w-full flex-row items-end gap-2">
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
      </div>
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
      {/* <InputFormField
        form={form}
        fieldName={'result'}
        label="DELETE ME"
        placeholder="Источнк"
        className={cn('flex-grow')}
        dirtyIndicator={isEdit}
      /> */}
      <SelectFormField
        form={form}
        fieldName={'result'}
        options={resultOptions}
        label="Результат"
        placeholder="Выбрать из списка"
        className={cn('flex-grow', !fields?.includes('result') && 'hidden')}
        popoverMinWidth={popoverMinWidth}
        dirtyIndicator={isEdit}
        valueType="string"
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
