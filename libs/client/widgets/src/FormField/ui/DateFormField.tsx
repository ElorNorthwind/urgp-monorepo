import {
  Button,
  Calendar,
  cn,
  FormControl,
  FormField,
  FormItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@urgp/client/shared';
import { CalendarIcon } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormInputLabel } from './components/FormInputLabel';
import { FormInputSkeleton } from './components/FormInputSkeleton';
import { format } from 'date-fns';
import { formItemClassName } from './config/formItem';

type DateFormFieldProps = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
  isLoading?: boolean;
  label?: string;
  placeholder?: string;
};

const DateFormField = (props: DateFormFieldProps): JSX.Element => {
  const {
    className,
    triggerClassName,
    popoverClassName,
    disabled = false,
    isLoading,
    form,
    fieldName,
    label = 'Дата',
    placeholder = 'Выберите дату',
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
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    disabled={disabled}
                    className={cn(
                      'w-32 justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground',
                      triggerClassName,
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {field.value ? (
                      <span className="truncate">
                        {format(field.value, 'dd.MM.yyyy')}
                      </span>
                    ) : (
                      <span className="truncate">{placeholder}</span>
                    )}
                  </Button>
                </PopoverTrigger>
                <PopoverContent
                  className={cn('h-[21.5rem] w-auto p-0', popoverClassName)}
                  side="top"
                >
                  <Calendar
                    mode="single"
                    selected={field.value}
                    onSelect={field.onChange}
                    disabled={(date) =>
                      date > new Date() || date < new Date('2017-01-01')
                    }
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
            </FormControl>
          )}
        </FormItem>
      )}
    />
  );
};
export { DateFormField };
