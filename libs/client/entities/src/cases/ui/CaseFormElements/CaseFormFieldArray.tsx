import {
  Button,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  useAuth,
} from '@urgp/client/shared';
import {
  DateFormField,
  FieldsArrayProps,
  InputFormField,
  SelectFormField,
  TextAreaFormField,
} from '@urgp/client/widgets';
import { CaseFormDto } from '@urgp/shared/entities';
import { SquareAsterisk, SquareUserRound } from 'lucide-react';
import { useState } from 'react';
import { Fragment } from 'react/jsx-runtime';
import {
  CaseTypeSelector,
  DirectionTypeSelector,
  ManualControlToSelector,
  ProblemSelector,
  useCurrentUserApproveTo,
} from '../../../classificators';
import { ExternalCaseFieldArray } from './ExternalCaseFieldArray';
import { endOfYesterday, isBefore } from 'date-fns';

const CaseFormFieldArray = ({
  form,
  isEdit,
  popoverMinWidth,
}: FieldsArrayProps<CaseFormDto>): JSX.Element | null => {
  const user = useAuth();
  const [manualControlTo, setManualControlTo] = useState(false);

  const canSkipDirections =
    user?.controlData?.roles &&
    user?.controlData?.roles.some((role) =>
      ['admin', 'boss', 'executor'].includes(role),
    );

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
      </div>
    </Fragment>
  );
};

export { CaseFormFieldArray };
