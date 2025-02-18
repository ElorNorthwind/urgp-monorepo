import { UseFormReturn } from 'react-hook-form';
import { useCaseDirectionTypes } from '../api/classificatorsApi';
import { MultiSelectFormField } from '@urgp/client/widgets';
import { cn, useUserAbility } from '@urgp/client/shared';
import { directionCategoryStyles } from '../../cases/config/caseStyles';
import { CreateCaseButton, useCases } from '../../cases';
import { CaseClasses } from '@urgp/shared/entities';
import { useMemo } from 'react';

type IncidentSelectorProps = {
  className?: string;
  triggerClassName?: string;
  popoverMinWidth?: string;
  disabled?: boolean;
  form: UseFormReturn<any, any>;
  fieldName: string;
  label?: string | null;
  placeholder?: string;
  dirtyIndicator?: boolean;
};

const IncidentSelector = (props: IncidentSelectorProps): JSX.Element => {
  const {
    className,
    triggerClassName,
    popoverMinWidth,
    disabled,
    form,
    fieldName,
    label = 'Системные проблемы',
    placeholder = 'Связанные системные проблемы (при наличии)',
    dirtyIndicator = false,
  } = props;

  const { data, isLoading, isFetching } = useCases();

  const formatedData = useMemo(() => {
    return [
      {
        value: CaseClasses.incident,
        label: 'Единичные инциденты',
        items: data
          ? [
              ...data.map((d) => ({
                value: d.id,
                label: d.title + ' (' + d.extra + ')',
                category: d.class,
                fullname: d.notes,
                tags: d.directions.map((dir) => dir.name),
              })),
            ]
          : [],
      },
    ];
  }, [data]);

  return (
    <MultiSelectFormField
      fieldName={fieldName}
      form={form}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      triggerClassName={triggerClassName}
      options={formatedData}
      isLoading={isLoading || isFetching || !data}
      className={className}
      popoverMinWidth={popoverMinWidth}
      dirtyIndicator={dirtyIndicator}
      extraButton={() => {
        return (
          <CreateCaseButton
            caseClass={CaseClasses.incident}
            variant="ghost"
            className="w-full"
            label="Добавить новый инцидент"
          />
        );
      }}
    />
  );
};

export { IncidentSelector };
