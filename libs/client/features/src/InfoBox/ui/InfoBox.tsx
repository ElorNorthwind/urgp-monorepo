import { ReactNode } from '@tanstack/react-router';
import {
  Button,
  Calendar,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from '@urgp/client/shared';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import { forwardRef, Fragment } from 'react';
import { DateRange } from 'react-day-picker';

type InfoBoxProps = {
  label?: string | number | Date;
  value?: string | number | Date;
  className?: string;
  noWrapper?: boolean;
  isLoading?: boolean;
};

const InfoBox = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & InfoBoxProps
>(
  (
    {
      label,
      value,
      className,
      noWrapper = false,
      isLoading = false,
    }: InfoBoxProps,
    ref,
  ): JSX.Element => {
    if (isLoading) return <Skeleton className={cn('h-10 w-full', className)} />;

    if (noWrapper)
      return (
        <Fragment>
          {label && (
            <div
              className={cn(
                'flex items-center px-2 py-2',
                'bg-muted-foreground/5 font-bold',
                value && 'border-r',
                className,
              )}
            >
              <span>
                {typeof label === 'object'
                  ? format(label, 'dd.MM.yyyy')
                  : label}
              </span>
            </div>
          )}
          {value && (
            <div className="flex items-center px-2 py-2">
              <span>
                {typeof value === 'object'
                  ? format(value, 'dd.MM.yyyy')
                  : value}
              </span>
            </div>
          )}
        </Fragment>
      );

    return (
      <div
        ref={ref}
        className={cn(
          'flex flex-grow flex-row items-stretch gap-0 rounded border *:flex *:items-center *:px-2 *:py-2',
          className,
        )}
      >
        {label && (
          <div
            className={cn(
              'bg-muted-foreground/5 font-bold',
              value && 'border-r',
            )}
          >
            <span>
              {typeof label === 'object' ? format(label, 'dd.MM.yyyy') : label}
            </span>
          </div>
        )}
        {value && (
          <div className="">
            <span>
              {typeof value === 'object' ? format(value, 'dd.MM.yyyy') : value}
            </span>
          </div>
        )}
      </div>
    );
  },
);

export { InfoBox };
