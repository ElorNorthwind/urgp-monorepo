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
import { formItemClassName } from './config/formItem';

type SelectFormFieldProps<T> = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  options?: Array<SelectOption<T>>;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  isLoading?: boolean;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
};

const SelectFormField = <T extends string | number>(
  props: SelectFormFieldProps<T>,
): JSX.Element => {
  const {
    options,
    className,
    triggerClassName,
    popoverClassName,
    isLoading,
    form,
    fieldName,
    label = 'Значение',
    placeholder = 'Выберите значение',
    disabled = false,
  } = props;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={cn(formItemClassName, className)}>
          <FormInputLabel form={form} fieldName={fieldName} label={label} />
          {isLoading || !options ? (
            <FormInputSkeleton />
          ) : (
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value?.toString()}
              disabled={disabled}
            >
              <FormControl>
                <SelectTrigger className={triggerClassName}>
                  <SelectValue placeholder={placeholder} />
                </SelectTrigger>
              </FormControl>
              <SelectContent className={popoverClassName}>
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
