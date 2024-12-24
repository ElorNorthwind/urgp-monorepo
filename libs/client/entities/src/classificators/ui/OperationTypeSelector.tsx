import { UseFormReturn } from 'react-hook-form';
import { useOperationTypes } from '../api/classificatorsApi';
import { ClassificatorFormField } from '@urgp/client/widgets';
import { operationTypeStyles } from '../../operations/config/operationStyles';
import { Circle } from 'lucide-react';
import { cn } from '@urgp/client/shared';

type OperationTypeSelectorProps = {
  className?: string;
  triggerClassName?: string;
  popoverMinWidth?: string;
  disabled?: boolean;
  form: UseFormReturn<any, any>;
  fieldName: string;
  label?: string;
  placeholder?: string;
  dirtyIndicator?: boolean;
};

const OperationTypeSelector = (
  props: OperationTypeSelectorProps,
): JSX.Element => {
  const {
    className,
    triggerClassName,
    popoverMinWidth,
    disabled,
    form,
    fieldName,
    label = 'Тип операции',
    placeholder = 'Выберите тип операции',
    dirtyIndicator = false,
  } = props;
  const { data, isLoading, isFetching } = useOperationTypes();
  return (
    <ClassificatorFormField
      fieldName={fieldName}
      form={form}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      triggerClassName={triggerClassName}
      classificator={data}
      isLoading={isLoading || isFetching}
      className={className}
      popoverMinWidth={popoverMinWidth}
      dirtyIndicator={dirtyIndicator}
      addItemBadge={(item) => {
        const { icon: StageIcon, iconStyle } = operationTypeStyles?.[
          item?.value || 0
        ] || {
          icon: Circle,
          iconStyle: 'text-muted-foreground/40',
        };
        return StageIcon ? (
          <StageIcon className={cn('size-4', iconStyle)} />
        ) : null;
      }}
    />
  );
};

export { OperationTypeSelector };
