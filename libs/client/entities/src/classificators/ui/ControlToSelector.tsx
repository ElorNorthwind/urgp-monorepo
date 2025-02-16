import { cn } from '@urgp/client/shared';
import { ClassificatorFormField, SelectFormField } from '@urgp/client/widgets';
import { UseFormReturn } from 'react-hook-form';
import { useUserControlTo } from '../api/classificatorsApi';

type ControlToSelectorProps = {
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

const ControlToSelector = (props: ControlToSelectorProps): JSX.Element => {
  const {
    className,
    triggerClassName,
    popoverMinWidth,
    disabled,
    form,
    fieldName,
    label = 'Исполнитель',
    placeholder = 'Выбор адресата поручения',
    dirtyIndicator = false,
  } = props;

  const {
    data: controlTo,
    isLoading: isControlToLoading,
    isFetching: isControlToFetching,
  } = useUserControlTo();

  return (
    <ClassificatorFormField
      isLoading={isControlToLoading || isControlToFetching}
      form={form}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      triggerClassName={triggerClassName}
      fieldName={fieldName}
      classificator={controlTo}
      className={cn(className)}
      popoverMinWidth={popoverMinWidth}
      dirtyIndicator={dirtyIndicator}
      // valueType={'string'}
    />
  );
};

export { ControlToSelector };
