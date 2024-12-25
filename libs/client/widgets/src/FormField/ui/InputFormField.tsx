import {
  cn,
  FormControl,
  FormField,
  FormItem,
  Input,
} from '@urgp/client/shared';
import { UseFormReturn } from 'react-hook-form';
import { FormInputLabel } from './components/FormInputLabel';
import { FormInputSkeleton } from './components/FormInputSkeleton';
import { formFieldStatusClassName, formItemClassName } from './config/formItem';

type InputFormFieldProps = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  className?: string;
  triggerClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string | null;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
  dirtyIndicator?: boolean;
};

const InputFormField = (props: InputFormFieldProps): JSX.Element => {
  const {
    className,
    triggerClassName,
    disabled = false,
    isLoading,
    form,
    fieldName,
    label = 'Значение',
    placeholder = 'Введите значение',
    type = 'text',
    dirtyIndicator = false,
  } = props;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState, formState }) => (
        <FormItem className={cn(formItemClassName, className)}>
          {label && <FormInputLabel fieldState={fieldState} label={label} />}
          {isLoading ? (
            <FormInputSkeleton />
          ) : (
            <FormControl>
              <Input
                className={cn(
                  formFieldStatusClassName({ dirtyIndicator, fieldState }),
                  triggerClassName,
                )}
                placeholder={placeholder}
                {...field}
                type={type}
                // value={field.value?.toString() || field.value}
                // defaultValue={field.value?.toString() || field.value}
                disabled={disabled || formState.isSubmitting}
              />
            </FormControl>
          )}
        </FormItem>
      )}
    />
  );
};
export { InputFormField };
