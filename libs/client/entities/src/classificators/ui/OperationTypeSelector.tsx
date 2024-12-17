import { UseFormReturn } from 'react-hook-form';
import { useOperationTypes } from '../api/classificatorsApi';
import { ClassificatorFormField } from '@urgp/client/widgets';

type OperationTypeSelectorProps = {
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
  form: UseFormReturn<any, any>;
  fieldName: string;
  label?: string;
  placeholder?: string;
};

const OperationTypeSelector = (
  props: OperationTypeSelectorProps,
): JSX.Element => {
  const {
    className,
    triggerClassName,
    popoverClassName,
    disabled,
    form,
    fieldName,
    label = 'Тип операции',
    placeholder = 'Выберите тип операции',
  } = props;
  const { data, isLoading, isFetching } = useOperationTypes();

  return (
    <ClassificatorFormField
      form={form}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      triggerClassName={triggerClassName}
      fieldName={fieldName}
      classificator={data}
      isLoading={isLoading || isFetching}
      className={className}
      popoverClassName={popoverClassName}
    />
  );
};

export { OperationTypeSelector };
