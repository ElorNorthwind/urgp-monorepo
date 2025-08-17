import { format, isValid, parse } from 'date-fns';
import * as React from 'react';
import { cn } from '../../lib/cn';

interface DateInputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'value' | 'onChange'
  > {
  leading?: React.ReactNode;
  trailing?: React.ReactNode;
  inputClassName?: string;
  value?: Date;
  onChange?: (date: Date | undefined) => void;
}

const DateInput = React.forwardRef<HTMLInputElement, DateInputProps>(
  (
    {
      leading,
      trailing,
      inputClassName,
      className,
      type,
      value,
      onChange,
      ...props
    },
    ref,
  ) => {
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const parsedDate = parse(e.target.value, 'yyyy-MM-dd', new Date());
      if (isValid(parsedDate)) {
        onChange?.(parsedDate);
      } else {
        onChange?.(undefined);
      }
    };

    return (
      <div
        className={cn(
          'border-input ring-offset-background focus-within:ring-ring group flex h-10 w-full overflow-hidden rounded-md border bg-transparent text-sm focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2',
          className,
        )}
      >
        {leading ? (
          <div className="border-input bg-muted border-r px-3 py-2">
            {leading}
          </div>
        ) : null}

        <input
          ref={ref}
          {...props}
          type="date"
          placeholder="дд.мм.гггг"
          value={format(value, 'yyyy-MM-dd')}
          onChange={handleInputChange}
          className={cn(
            'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
            className,
          )}
        />
        {/* <input
         type={type}
         className={cn(
           'border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex h-10 w-full rounded-md border px-3 py-2 text-sm file:border-0 file:bg-transparent file:text-sm file:font-medium focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
           className,
         )}
         ref={ref}
         {...props}
       />

        <input
          className={cn(
            'placeholder:text-muted-foreground bg-background w-full rounded-md px-3 py-2 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50',
            inputClassName,
          )}
          type={type}
          ref={ref}
          {...props}
        /> */}
        {trailing ? (
          <div className="border-input bg-muted border-l px-3 py-2">
            {trailing}
          </div>
        ) : null}
      </div>
    );
  },
);

DateInput.displayName = 'DateInput';

export { DateInput };
