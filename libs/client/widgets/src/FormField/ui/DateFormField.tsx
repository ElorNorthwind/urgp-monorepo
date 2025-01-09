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
import { formFieldStatusClassName, formItemClassName } from './config/formItem';
import { use } from 'passport';
import { useState } from 'react';

type DateFormFieldProps = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  disabled?: boolean;
  isLoading?: boolean;
  label?: string | null;
  placeholder?: string;
  dirtyIndicator?: boolean;
  stayOpen?: boolean;
  disabledDays?: (date: Date) => boolean;
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
    dirtyIndicator = false,
    stayOpen = false,
    disabledDays,
  } = props;

  const [open, setOpen] = useState(false);

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
              <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                  <Button
                    variant={'outline'}
                    disabled={disabled || formState.isSubmitting}
                    className={cn(
                      'w-34 justify-start text-left font-normal',
                      !field.value && 'text-muted-foreground',
                      formFieldStatusClassName({ dirtyIndicator, fieldState }),
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
                    onSelect={(e) => {
                      !stayOpen && setOpen(false);
                      field.onChange(e);
                    }}
                    disabled={disabledDays}
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
