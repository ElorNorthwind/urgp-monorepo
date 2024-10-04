import { ReactNode } from '@tanstack/react-router';
import {
  Button,
  Calendar,
  ChartConfig,
  ChartTooltip,
  ChartTooltipContent,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@urgp/client/shared';
import { format } from 'date-fns';
import { ru } from 'date-fns/locale';
import { CalendarIcon } from 'lucide-react';
import { ReactElement, SVGProps } from 'react';
import { DateRange } from 'react-day-picker';

type DateRangeSelectProps = {
  from?: Date;
  to?: Date;
  onSelect?: (range: DateRange | undefined) => void;
  className?: string;
  label?: ReactNode;
};

const DateRangeSelect = ({
  className,
  from,
  to,
  label,
  onSelect,
}: DateRangeSelectProps): JSX.Element => {
  return (
    <div className={cn('grid gap-2')}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id="date"
            variant={'outline'}
            className={cn(
              'h-8 justify-start text-left font-normal',
              !from && !to && 'text-muted-foreground',
              className,
            )}
          >
            <div className="text-muted-foreground mr-2">Старт:</div>
            <CalendarIcon className="mr-2 h-4 w-4" />
            {from ? (
              to ? (
                <>
                  {format(from, 'dd.MM.yyyy')} - {format(to, 'dd.MM.yyyy')}
                </>
              ) : (
                format(from, 'dd.MM.yyyy')
              )
            ) : (
              <span>Выберете дату</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            initialFocus
            mode="range"
            defaultMonth={from}
            selected={{
              from,
              to,
            }}
            onSelect={onSelect}
            numberOfMonths={2}
          />
        </PopoverContent>
      </Popover>
    </div>
  );
};

export { DateRangeSelect };
