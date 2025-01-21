import {
  cn,
  FormControl,
  FormField,
  FormItem,
  Textarea,
} from '@urgp/client/shared';
import { UseFormReturn } from 'react-hook-form';
import { FormInputLabel } from './components/FormInputLabel';
import { formFieldStatusClassName, formItemClassName } from './config/formItem';
import { InputSkeleton } from '@urgp/client/features';

type TextAreaFormFieldProps = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  className?: string;
  triggerClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string | null;
  placeholder?: string;
  dirtyIndicator?: boolean;
};

const TextAreaFormField = (props: TextAreaFormFieldProps): JSX.Element => {
  const {
    className,
    triggerClassName,
    isLoading,
    disabled = false,
    form,
    fieldName,
    label = 'Значение',
    placeholder = 'Введите значение',
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
            <InputSkeleton />
          ) : (
            <FormControl>
              <Textarea
                disabled={disabled || formState.isSubmitting}
                placeholder={placeholder}
                {...field}
                // name={field.name}
                className={cn(
                  formFieldStatusClassName({ dirtyIndicator, fieldState }),
                  triggerClassName,
                )}
              />
            </FormControl>
          )}
        </FormItem>
      )}
    />
  );
};
export { TextAreaFormField };
