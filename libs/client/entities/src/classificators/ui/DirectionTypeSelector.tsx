import { UseFormReturn } from 'react-hook-form';
import { useCaseDirectionTypes } from '../api/classificatorsApi';
import { MultiSelectFormField } from '@urgp/client/widgets';
import { cn } from '@urgp/client/shared';
import { directionCategoryStyles } from '../../cases/config/caseStyles';

type DirectionTypeSelectorProps = {
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
  form: UseFormReturn<any, any>;
  fieldName: string;
  label?: string | null;
  placeholder?: string;
  dirtyIndicator?: boolean;
};

const DirectionTypeSelector = (
  props: DirectionTypeSelectorProps,
): JSX.Element => {
  const {
    className,
    triggerClassName,
    popoverClassName,
    disabled,
    form,
    fieldName,
    label = 'Направления работы',
    placeholder = 'Выберите направления',
    dirtyIndicator = false,
  } = props;
  const { data, isLoading, isFetching } = useCaseDirectionTypes();

  return (
    <MultiSelectFormField
      fieldName={fieldName}
      form={form}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      triggerClassName={triggerClassName}
      options={data}
      isLoading={isLoading || isFetching || !data}
      className={className}
      popoverClassName={popoverClassName}
      dirtyIndicator={dirtyIndicator}
      addBadgeStyle={(item) => {
        return cn(
          directionCategoryStyles?.[item?.category || '']?.badgeStyle || '',
          'px-2',
        );
      }}
      addItemBadge={(item) => {
        return (
          <div
            className={cn(
              'size-4 flex-shrink-0',
              directionCategoryStyles?.[item?.category || '']?.iconStyle || '',
            )}
          />
        );
      }}
    />
  );
};

export { DirectionTypeSelector };
