import { UseFormReturn } from 'react-hook-form';
import {
  useCaseDirectionTypes,
  useUserControlTo,
} from '../api/classificatorsApi';
import { MultiSelectFormField } from '@urgp/client/widgets';
import { cn } from '@urgp/client/shared';
import { directionCategoryStyles } from '../../cases/config/caseStyles';
import { ClassificatorInfo } from '@urgp/shared/entities';

type ManualControlToSelectorProps = {
  className?: string;
  triggerClassName?: string;
  popoverMinWidth?: string;
  disabled?: boolean;
  form: UseFormReturn<any, any>;
  fieldName: string;
  label?: string | null;
  placeholder?: string;
  dirtyIndicator?: boolean;
  lockOption?: (option?: ClassificatorInfo) => boolean;
};

const ManualControlToSelector = (
  props: ManualControlToSelectorProps,
): JSX.Element => {
  const {
    className,
    triggerClassName,
    popoverMinWidth,
    disabled,
    form,
    fieldName,
    label = 'Исполнитель',
    placeholder = 'Ответственный начальник управления',
    dirtyIndicator = false,
    lockOption,
  } = props;
  const { data, isLoading, isFetching } = useUserControlTo();

  return (
    <MultiSelectFormField
      fieldName={fieldName}
      form={form}
      label={label}
      placeholder={placeholder}
      disabled={disabled}
      triggerClassName={triggerClassName}
      options={data?.filter((g) => g.value === 'executors')}
      isLoading={isLoading || isFetching || !data}
      className={className}
      popoverMinWidth={popoverMinWidth}
      dirtyIndicator={dirtyIndicator}
      lockOption={lockOption}
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

export { ManualControlToSelector };
