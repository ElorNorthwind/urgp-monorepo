import {
  Checkbox,
  cn,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  Input,
  Skeleton,
} from '@urgp/client/shared';
import { UseFormReturn } from 'react-hook-form';
import { FormInputLabel } from './components/FormInputLabel';
import { formFieldStatusClassName, formItemClassName } from './config/formItem';
import { InputSkeleton } from '@urgp/client/features';

// <Checkbox
//   className="size-5"
//   checked={props.row.getIsSelected()}
//   disabled={!props.row.getCanSelect()}
//   onClick={props.row.getToggleSelectedHandler()}
// />

type CheckboxFormFieldProps = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  className?: string;
  triggerClassName?: string;
  isLoading?: boolean;
  disabled?: boolean;
  label?: string | null;
  placeholder?: string | null;
  dirtyIndicator?: boolean;
};

const CheckboxFormField = (props: CheckboxFormFieldProps): JSX.Element => {
  const {
    className,
    triggerClassName,
    disabled = false,
    isLoading,
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
        <FormItem
          className={cn(
            'relative flex flex-row items-start space-x-10 space-y-0 rounded-md border p-4',
            formItemClassName,
            className,
          )}
        >
          {/* <FormControl>
            {isLoading ? (
              <Skeleton className={cn('size-5', triggerClassName)} />
            ) : (
              <Checkbox
                disabled={disabled || formState.isSubmitting}
                className={cn(
                  'size-5 flex-shrink-0',
                  formFieldStatusClassName({ dirtyIndicator, fieldState }),
                  triggerClassName,
                )}
                checked={field.value}
                onCheckedChange={field.onChange}
              />
            )}
          </FormControl> */}
          <FormControl>
            <Checkbox
              disabled={disabled || formState.isSubmitting}
              className={cn(
                'absolute left-5 top-5 size-5',
                formFieldStatusClassName({ dirtyIndicator, fieldState }),
                triggerClassName,
              )}
              checked={field.value}
              onCheckedChange={field.onChange}
            />
          </FormControl>
          <div className="space-1 leading-none">
            <FormLabel>{label}</FormLabel>
            <FormDescription>
              {fieldState?.error ? (
                <span className="text-rose-500">
                  fieldState.error.message?.toString()
                </span>
              ) : (
                <span>{placeholder || ''}</span>
              )}
            </FormDescription>
          </div>
        </FormItem>

        // <FormItem className={cn(formItemClassName, className)}>
        //   {isLoading ? (
        //     <InputSkeleton />
        //   ) : (
        //     <>

        //       <FormControl>
        //         <Checkbox
        //           className={cn(
        //             formFieldStatusClassName({ dirtyIndicator, fieldState }),
        //             triggerClassName,
        //           )}
        //           {...field}
        //           checked={field.value}

        //           // value={field.value?.toString() || field.value}
        //           // defaultValue={field.value?.toString() || field.value}
        //           disabled={disabled || formState.isSubmitting}
        //         />
        //       </FormControl>
        //       {label && (
        //         <FormInputLabel fieldState={fieldState} label={label} />
        //       )}
        //     </>
        //   )}
        // </FormItem>
      )}
    />
  );
};
export { CheckboxFormField };
