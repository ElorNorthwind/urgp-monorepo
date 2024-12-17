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
import { formItemClassName } from './config/formItem';

type InputFormFieldProps = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  className?: string;
  triggerClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string;
  placeholder?: string;
  type?: React.InputHTMLAttributes<HTMLInputElement>['type'];
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
              <Input
                className={triggerClassName}
                disabled={disabled}
                placeholder={placeholder}
                {...field}
                name={fieldName}
                type={type}
              />
            </FormControl>
          )}
        </FormItem>
      )}
    />
  );
};
export { InputFormField };
