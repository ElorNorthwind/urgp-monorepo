import { UseFormReturn } from 'react-hook-form';
import { useCaseTypes } from '../api/classificatorsApi';
import { ClassificatorFormField } from '@urgp/client/widgets';

type CaseTypeSelectorProps = {
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
  form: UseFormReturn<any, any>;
  fieldName: string;
  label?: string;
  placeholder?: string;
};

const CaseTypeSelector = (props: CaseTypeSelectorProps): JSX.Element => {
  const {
    className,
    triggerClassName,
    popoverClassName,
    disabled,
    form,
    fieldName,
    label = 'Тип дела',
    placeholder = 'Выберите тип дела',
  } = props;
  const { data, isLoading, isFetching } = useCaseTypes();

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

export { CaseTypeSelector };
