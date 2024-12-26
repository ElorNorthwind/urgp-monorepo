import { UseFormReturn } from 'react-hook-form';
import { useCaseTypes } from '../api/classificatorsApi';
import { ClassificatorFormField } from '@urgp/client/widgets';
import { caseTypeStyles } from '../../cases/config/caseStyles';
import { MessageSquareMore } from 'lucide-react';
import { cn } from '@urgp/client/shared';

type CaseTypeSelectorProps = {
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

const CaseTypeSelector = (props: CaseTypeSelectorProps): JSX.Element => {
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
      isLoading={isLoading || isFetching || !data}
      className={className}
      popoverMinWidth={popoverMinWidth}
      dirtyIndicator={dirtyIndicator}
      addItemBadge={(item) => {
        const { icon: TypeIcon, iconStyle } = caseTypeStyles[
          item?.value || 0
        ] || { icon: MessageSquareMore, iconStyle: 'text-slate-500' };
        return TypeIcon ? (
          <TypeIcon className={cn('size-6', iconStyle)} />
        ) : null;
      }}
    />
  );
};

export { CaseTypeSelector };
