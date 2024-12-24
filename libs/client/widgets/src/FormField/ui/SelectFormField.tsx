import {
  cn,
  FormControl,
  FormField,
  FormItem,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@urgp/client/shared';
import { SelectOption } from '@urgp/shared/entities';
import { UseFormReturn } from 'react-hook-form';
import { FormInputLabel } from './components/FormInputLabel';
import { FormInputSkeleton } from './components/FormInputSkeleton';
import { formFieldStatusClassName, formItemClassName } from './config/formItem';

type SelectFormFieldProps<T> = {
  fieldName: string;
  form: UseFormReturn<any, any>;
  options?: Array<SelectOption<T>>;
  className?: string;
  triggerClassName?: string;
  popoverMinWidth?: string;
  isLoading?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  dirtyIndicator?: boolean;
};

const SelectFormField = <T extends string | number>(
  props: SelectFormFieldProps<T>,
): JSX.Element => {
  const {
    options,
    className,
    triggerClassName,
    popoverMinWidth,
    isLoading,
    form,
    fieldName,
    label = 'Значение',
    placeholder = 'Выберите значение',
    disabled = false,
    dirtyIndicator = false,
  } = props;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState, formState }) => (
        <FormItem className={cn(formItemClassName, className)}>
          <FormInputLabel fieldState={fieldState} label={label} />
          {isLoading || !options ? (
            <FormInputSkeleton />
          ) : (
            <Select
              onValueChange={field.onChange}
              value={field.value?.toString() || field.value}
              defaultValue={field.value?.toString() || field.value}
              disabled={disabled || formState.isSubmitting}
              name={field.name}
            >
              <FormControl>
                <SelectTrigger
                  className={cn(
                    formFieldStatusClassName({ dirtyIndicator, fieldState }),
                    triggerClassName,
                  )}
                  ref={field.ref}
                >
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent style={{ minWidth: popoverMinWidth }}>
                {options.map((option) => (
                  <SelectItem
                    key={option.value}
                    value={
                      typeof option.value === 'string'
                        ? option.value
                        : option.value.toString()
                    }
                  >
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </FormItem>
      )}
    />
  );
};

export { SelectFormField };
