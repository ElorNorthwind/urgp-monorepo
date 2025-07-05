import { cn } from '@urgp/client/shared';
import { ClassificatorFormField } from '@urgp/client/widgets';
import { UseFormReturn } from 'react-hook-form';
import {
  equityOperationTypeStyles,
  useEquityOperationTypes,
} from '../../../equityClassificators';

type EquityOperationTypeSelectorProps = {
  className?: string;
  triggerClassName?: string;
  popoverMinWidth?: string;
  commandListClassName?: string;
  disabled?: boolean;
  form: UseFormReturn<any, any>;
  fieldName: string;
  label?: string | null;
  placeholder?: string;
  dirtyIndicator?: boolean;
};

const EquityOperationTypeSelector = (
  props: EquityOperationTypeSelectorProps,
): JSX.Element => {
  const {
    className,
    triggerClassName,
    commandListClassName,
    popoverMinWidth,
    disabled,
    form,
    fieldName,
    label = 'Тип операции',
    placeholder = 'Выберите тип операции',
    dirtyIndicator = false,
  } = props;
  const { data, isLoading, isFetching } = useEquityOperationTypes();

  return (
    <ClassificatorFormField
      form={form}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      triggerClassName={triggerClassName}
      commandListClassName={commandListClassName}
      fieldName={fieldName}
      classificator={data}
      isLoading={isLoading || isFetching || !data}
      className={className}
      popoverMinWidth={popoverMinWidth}
      dirtyIndicator={dirtyIndicator}
      addItemBadge={(item) => {
        const { icon: TypeIcon, iconStyle } =
          equityOperationTypeStyles[item?.value || 0] ||
          equityOperationTypeStyles[0];
        return TypeIcon ? (
          <TypeIcon className={cn('size-6', iconStyle)} />
        ) : null;
      }}
    />
  );
};

export { EquityOperationTypeSelector };
