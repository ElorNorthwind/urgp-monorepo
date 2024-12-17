import {
  cn,
  FormControl,
  FormField,
  FormItem,
  Textarea,
} from '@urgp/client/shared';
import { UseFormReturn } from 'react-hook-form';
import { FormInputLabel } from './components/FormInputLabel';
import { FormInputSkeleton } from './components/FormInputSkeleton';
import { formItemClassName } from './config/formItem';

type TextAreaFormFieldProps = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  className?: string;
  triggerClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
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
  } = props;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className={cn(formItemClassName, className)}>
          <FormInputLabel form={form} fieldName={fieldName} label={label} />
          {isLoading ? (
            <FormInputSkeleton />
          ) : (
            <FormControl>
              <Textarea
                disabled={disabled}
                placeholder={placeholder}
                {...field}
                name={fieldName}
                className={triggerClassName}
              />
            </FormControl>
          )}
        </FormItem>
      )}
    />
  );
};
export { TextAreaFormField };
