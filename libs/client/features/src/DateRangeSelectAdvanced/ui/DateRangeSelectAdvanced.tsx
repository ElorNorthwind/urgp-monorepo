/* eslint-disable max-lines */
'use client';

import {
  Button,
  Calendar,
  cn,
  DateInput,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  useIsMobile,
} from '@urgp/client/shared';
import { subDays, toDate } from 'date-fns';
import { CheckIcon, ChevronDownIcon, ChevronUpIcon } from 'lucide-react';
import React, { type FC, useState, useEffect, useRef } from 'react';

type DateRangeSelectAdvancedProps = {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (values: { range: DateRange; rangeCompare?: DateRange }) => void;
  /** Initial value for start date */
  initialDateFrom?: Date | string;
  /** Initial value for end date */
  initialDateTo?: Date | string;
  /** Initial value for start date for compare */
  align?: 'start' | 'center' | 'end';
  /** Option for locale */
  locale?: string;
};

const formatDate = (date: Date, locale: string = 'ru-RU'): string => {
  return date.toLocaleDateString(locale, {
    month: 'numeric',
    day: 'numeric',
    year: 'numeric',
  });
};

const getDateAdjustedForTimezone = (dateInput: Date | string): Date => {
  if (typeof dateInput === 'string') {
    return toDate(dateInput);
  } else {
    return dateInput;
  }
};

type DateRange = {
  from: Date;
  to: Date | undefined;
};

type Preset = {
  name: string;
  label: string;
};

// Define presets
const PRESETS: Preset[] = [
  { name: 'today', label: 'Сегодня' },
  { name: 'yesterday', label: 'Вчера' },
  { name: 'last30', label: 'Последние 30 дней' },
  { name: 'thisWeek', label: 'Эта неделя' },
  { name: 'lastWeek', label: 'Прошлая неделя' },
  { name: 'thisMonth', label: 'Этот месяц' },
  { name: 'thisQuarter', label: 'Этот квартал' },
  { name: 'thisYear', label: 'Этот год' },
];

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangeSelectAdvanced: FC<DateRangeSelectAdvancedProps> = ({
  initialDateFrom = new Date(subDays(new Date(), 30).setHours(0, 0, 0, 0)),
  initialDateTo,
  onUpdate,
  align = 'end',
  locale = 'ru-Ru',
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const [range, setRange] = useState<DateRange>({
    from: getDateAdjustedForTimezone(initialDateFrom),
    to: initialDateTo
      ? getDateAdjustedForTimezone(initialDateTo)
      : getDateAdjustedForTimezone(initialDateFrom),
  });

  // Refs to store the values of range and rangeCompare when the date picker is opened
  const openedRangeRef = useRef<DateRange | undefined>();

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined,
  );

  const isMobile = useIsMobile();

  const getPresetRange = (presetName: string): DateRange => {
    const preset = PRESETS.find(({ name }) => name === presetName);
    if (!preset) throw new Error(`Неизвестный пресет дат: ${presetName}`);
    const from = new Date();
    const to = new Date();
    const first = from.getDate() - from.getDay();

    switch (preset.name) {
      case 'today':
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case 'yesterday':
        from.setDate(from.getDate() - 1);
        from.setHours(0, 0, 0, 0);
        to.setDate(to.getDate() - 1);
        to.setHours(23, 59, 59, 999);
        break;
      case 'last30':
        from.setDate(from.getDate() - 29);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case 'thisWeek':
        from.setDate(first);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case 'lastWeek':
        from.setDate(from.getDate() - 7 - from.getDay());
        to.setDate(to.getDate() - to.getDay() - 1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case 'thisMonth':
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setHours(23, 59, 59, 999);
        break;
      case 'thisQuarter':
        from.setMonth((from.getMonth() - 1) / 3 + 1);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setDate(0);
        to.setHours(23, 59, 59, 999);
        break;
      case 'thisYear':
        from.setMonth(1);
        from.setDate(1);
        from.setHours(0, 0, 0, 0);
        to.setDate(0);
        to.setHours(23, 59, 59, 999);
        break;
    }
    return { from, to };
  };

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset);
    setRange(range);
  };

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);

      const normalizedRangeFrom = new Date(range.from);
      normalizedRangeFrom.setHours(0, 0, 0, 0);
      const normalizedPresetFrom = new Date(
        presetRange.from.setHours(0, 0, 0, 0),
      );

      const normalizedRangeTo = new Date(range.to ?? 0);
      normalizedRangeTo.setHours(0, 0, 0, 0);
      const normalizedPresetTo = new Date(
        presetRange.to?.setHours(0, 0, 0, 0) ?? 0,
      );

      if (
        normalizedRangeFrom.getTime() === normalizedPresetFrom.getTime() &&
        normalizedRangeTo.getTime() === normalizedPresetTo.getTime()
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }

    setSelectedPreset(undefined);
  };

  const resetValues = (): void => {
    setRange({
      from:
        typeof initialDateFrom === 'string'
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom,
      to: initialDateTo
        ? typeof initialDateTo === 'string'
          ? getDateAdjustedForTimezone(initialDateTo)
          : initialDateTo
        : typeof initialDateFrom === 'string'
          ? getDateAdjustedForTimezone(initialDateFrom)
          : initialDateFrom,
    });
  };

  useEffect(() => {
    checkPreset();
  }, [range]);

  const PresetButton = ({
    preset,
    label,
    isSelected,
  }: {
    preset: string;
    label: string;
    isSelected: boolean;
  }): JSX.Element => (
    <Button
      className={cn(isSelected && 'pointer-events-none')}
      variant="ghost"
      onClick={() => {
        setPreset(preset);
      }}
    >
      <>
        <span className={cn('pr-2 opacity-0', isSelected && 'opacity-70')}>
          <CheckIcon width={18} height={18} />
        </span>
        {label}
      </>
    </Button>
  );

  // Helper function to check if two date ranges are equal
  const areRangesEqual = (a?: DateRange, b?: DateRange): boolean => {
    if (!a || !b) return a === b; // If either is undefined, return true if both are undefined
    return (
      a.from.getTime() === b.from.getTime() &&
      (!a.to || !b.to || a.to.getTime() === b.to.getTime())
    );
  };

  useEffect(() => {
    if (isOpen) {
      openedRangeRef.current = range;
    }
  }, [isOpen]);

  return (
    <Popover
      modal={true}
      open={isOpen}
      onOpenChange={(open: boolean) => {
        if (!open) {
          resetValues();
        }
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button size={'lg'} variant="outline">
          <div className="text-right">
            <div className="py-1">
              <div>{`${formatDate(range.from, locale)}${
                range.to != null ? ' - ' + formatDate(range.to, locale) : ''
              }`}</div>
            </div>
          </div>
          <div
            className={cn(
              '-mr-2 scale-125 pl-1 opacity-60 transition-transform',
              isOpen && 'rotate-180',
            )}
          >
            <ChevronUpIcon width={24} />
          </div>
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto">
        <div className="flex py-2">
          <div className="flex">
            <div className="flex flex-col">
              <div className="flex flex-col items-center justify-end gap-2 px-3 pb-4 lg:flex-row lg:items-start lg:pb-0">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <DateInput
                      value={range.from}
                      onChange={(date) => {
                        const toDate =
                          range.to == null || date > range.to ? date : range.to;
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: date,
                          to: toDate,
                        }));
                      }}
                    />
                    <div className="py-1">-</div>
                    <DateInput
                      value={range.to}
                      onChange={(date) => {
                        const fromDate = date < range.from ? date : range.from;
                        setRange((prevRange) => ({
                          ...prevRange,
                          from: fromDate,
                          to: date,
                        }));
                      }}
                    />
                  </div>
                </div>
              </div>
              {isMobile && (
                <Select
                  defaultValue={selectedPreset}
                  onValueChange={(value) => {
                    setPreset(value);
                  }}
                >
                  <SelectTrigger className="mx-auto mb-2 w-[180px]">
                    <SelectValue placeholder="Выбрать..." />
                  </SelectTrigger>
                  <SelectContent>
                    {PRESETS.map((preset) => (
                      <SelectItem key={preset.name} value={preset.name}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
              <div>
                <Calendar
                  mode="range"
                  onSelect={(value: { from?: Date; to?: Date } | undefined) => {
                    if (value?.from != null) {
                      setRange({ from: value.from, to: value?.to });
                    }
                  }}
                  selected={range}
                  numberOfMonths={isMobile ? 1 : 2}
                  defaultMonth={
                    new Date(
                      new Date().setMonth(
                        new Date().getMonth() - (isMobile ? 0 : 1),
                      ),
                    )
                  }
                />
              </div>
            </div>
          </div>
          {!isMobile && (
            <div className="flex flex-col items-end gap-1 pb-6 pl-6 pr-2">
              <div className="flex w-full flex-col items-end gap-1 pb-6 pl-6 pr-2">
                {PRESETS.map((preset) => (
                  <PresetButton
                    key={preset.name}
                    preset={preset.name}
                    label={preset.label}
                    isSelected={selectedPreset === preset.name}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
        <div className="flex justify-end gap-2 py-2 pr-4">
          <Button
            onClick={() => {
              setIsOpen(false);
              resetValues();
            }}
            variant="ghost"
          >
            Отменить
          </Button>
          <Button
            onClick={() => {
              setIsOpen(false);
              if (!areRangesEqual(range, openedRangeRef.current)) {
                onUpdate?.({ range });
              }
            }}
          >
            Выбрать
          </Button>
        </div>
      </PopoverContent>
    </Popover>
  );
};

DateRangeSelectAdvanced.displayName = 'DateRangeSelectAdvanced';

// type DateRangeSelectAdvancedProps = {
//   from?: Date;
//   to?: Date;
//   onSelect?: (range: DateRange | undefined) => void;
//   className?: string;
//   label?: ReactNode;
//   placeholder?: string;
//   align?: 'center' | 'end' | 'start';
// };

// const DateRangeSelectAdvanced = ({
//   className,
//   from,
//   to,
//   label = 'Старт',
//   placeholder = 'Выберите дату',
//   onSelect,
//   align = 'start',
// }: DateRangeSelectAdvancedProps): JSX.Element => {
//   return (
//     <div className={cn('grid gap-2')}>
//       <Popover>
//         <PopoverTrigger asChild>
//           <Button
//             id="date"
//             variant={'outline'}
//             className={cn(
//               'h-8 justify-start text-left font-normal',
//               !from && !to && 'text-muted-foreground',
//               className,
//             )}
//           >
//             <div className="text-muted-foreground mr-2">{label + ':'}</div>
//             <CalendarIcon className="mr-2 h-4 w-4" />
//             {from ? (
//               to ? (
//                 <>
//                   {format(from, 'dd.MM.yyyy')} - {format(to, 'dd.MM.yyyy')}
//                 </>
//               ) : (
//                 format(from, 'dd.MM.yyyy')
//               )
//             ) : (
//               <span>{placeholder}</span>
//             )}
//           </Button>
//         </PopoverTrigger>
//         <PopoverContent className="w-auto p-1" align={align}>
//           <Calendar
//             captionLayout={'dropdown'}
//             mode="range"
//             defaultMonth={from}
//             selected={{
//               from,
//               to,
//             }}
//             onSelect={onSelect}
//             numberOfMonths={2}
//           />
//         </PopoverContent>
//       </Popover>
//     </div>
//   );
// };

// export { DateRangeSelectAdvanced };
