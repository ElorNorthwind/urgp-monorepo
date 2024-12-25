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
  label?: string | null;
  placeholder?: string;
  disabled?: boolean;
  dirtyIndicator?: boolean;
  valueType?: 'string' | 'number';
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
    valueType = 'number',
  } = props;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState, formState }) => (
        <FormItem className={cn(formItemClassName, className)}>
          {label && <FormInputLabel fieldState={fieldState} label={label} />}
          {isLoading || !options ? (
            <FormInputSkeleton />
          ) : (
            <Select
              onValueChange={
                (v) => field.onChange(valueType === 'number' ? parseInt(v) : v) // that's gonna bite me in the arse wont it?
              }
              value={
                valueType === 'number' ? field.value?.toString() : field.value
              }
              defaultValue={
                valueType === 'number' ? field.value?.toString() : field.value
              }
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
