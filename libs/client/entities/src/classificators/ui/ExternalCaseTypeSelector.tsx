import { cn } from '@urgp/client/shared';
import { SelectFormField } from '@urgp/client/widgets';
import { UseFormReturn } from 'react-hook-form';

// system: z.enum(['EDO', 'SPD', 'SPD2', 'HOTLINE', 'CONSULTATION', 'NONE'])

const externalCaseTypes = [
  { label: 'ЭДО', value: 'EDO' },
  { label: 'СПД', value: 'SPD' },
  { label: 'СПД-2', value: 'SPD2' },
  { label: 'Линия', value: 'HOTLINE' },
  { label: 'ВКС', value: 'CONSULTATION' },
  { label: 'Другое', value: 'NONE' },
];

type ExternalCaseTypeSelectorProps = {
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

const ExternalCaseTypeSelector = (
  props: ExternalCaseTypeSelectorProps,
): JSX.Element => {
  const {
    className,
    triggerClassName,
    popoverMinWidth,
    disabled,
    form,
    fieldName,
    label = 'Тип дела',
    placeholder = 'Выберите тип дела',
    dirtyIndicator = false,
  } = props;

  return (
    <SelectFormField
      form={form}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      triggerClassName={triggerClassName}
      fieldName={fieldName}
      options={externalCaseTypes}
      className={cn('min-w-[91px]', className)}
      popoverMinWidth={popoverMinWidth}
      dirtyIndicator={dirtyIndicator}
      valueType={'string'}
    />
  );
};

export { ExternalCaseTypeSelector };
