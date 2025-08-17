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
import { format, isEqual, startOfDay, toDate } from 'date-fns';
import { CalendarIcon, CheckIcon, ChevronUpIcon } from 'lucide-react';
import { type FC, useEffect, useRef, useState } from 'react';
import { DEFAULT_PRESET_RANGE, PRESETS } from '../config/datePresets';
import { on } from 'events';

type DateRangeDirty = {
  from: Date | string | undefined;
  to: Date | string | undefined;
};

type DateRangeClean = {
  from: Date;
  to: Date;
};

const PresetButton = ({
  preset,
  label,
  isSelected,
  setPreset,
}: {
  preset: string;
  label: string;
  isSelected: boolean;
  setPreset: (preset: string) => void;
}): JSX.Element => (
  <Button
    className={cn(
      'flex flex-row items-center gap-2',
      isSelected && 'pointer-events-none border',
    )}
    variant="ghost"
    onClick={() => {
      setPreset(preset);
    }}
  >
    <CheckIcon
      className={cn(
        'size-4 flex-shrink-0',
        isSelected ? 'opacity-70' : 'opacity-0',
      )}
    />
    <span className="flex-grow text-left"> {label}</span>
  </Button>
);

type DateRangeSelectAdvancedProps = {
  /** Click handler for applying the updates from DateRangePicker. */
  onUpdate?: (range: DateRangeClean | undefined) => void;
  /** Initial range values*/
  initialRange?: DateRangeDirty;
  /** Controlled range values*/
  controlledRange?: DateRangeDirty;
  /** Popover align*/
  align?: 'start' | 'center' | 'end';
  /** Option for locale */
  className?: string;
  /** Apply changes only on button click*/
  confirmationButtons?: boolean;
  /** Apply undefined value on default range*/
  undefinedOnDefault?: boolean;
};

/** The DateRangePicker component allows a user to select a range of dates */
export const DateRangeSelectAdvanced: FC<DateRangeSelectAdvancedProps> = ({
  initialRange = DEFAULT_PRESET_RANGE,
  controlledRange,
  onUpdate,
  align = 'end',
  className,
  confirmationButtons = false,
  undefinedOnDefault = false,
}): JSX.Element => {
  const [isOpen, setIsOpen] = useState(false);

  const clearRange = (
    ranges: Array<DateRangeDirty | undefined>,
  ): DateRangeClean => {
    return ranges
      .filter((r) => !!r)
      .reverse()
      .reduce(
        (acc, cur) => {
          return {
            from: cur?.from ? toDate(cur?.from) : acc.from,
            to: cur?.to
              ? toDate(cur?.to)
              : cur?.from
                ? toDate(cur?.from)
                : acc.to,
          };
        },
        {
          from: toDate(initialRange?.from ?? DEFAULT_PRESET_RANGE.from),
          to: toDate(initialRange?.to ?? DEFAULT_PRESET_RANGE.to),
        },
      ) as DateRangeClean;
  };

  const [range, setRange] = useState<DateRangeClean>(
    clearRange([controlledRange]),
  );

  // Refs to store the values of range and rangeCompare when the date picker is opened
  const openedRangeRef = useRef<DateRangeClean | undefined>();

  const [selectedPreset, setSelectedPreset] = useState<string | undefined>(
    undefined,
  );

  const isMobile = useIsMobile();

  const getPresetRange = (presetName: string): DateRangeClean => {
    const preset = PRESETS.find(({ name }) => name === presetName);
    if (!preset) throw new Error(`Неизвестный пресет дат: ${presetName}`);
    return { from: preset.from, to: preset.to };
  };

  const checkPreset = (): void => {
    for (const preset of PRESETS) {
      const presetRange = getPresetRange(preset.name);
      if (
        isEqual(
          startOfDay(presetRange?.from ?? 0),
          startOfDay(range?.from ?? 0),
        ) &&
        isEqual(startOfDay(presetRange?.to ?? 0), startOfDay(range?.to ?? 0))
      ) {
        setSelectedPreset(preset.name);
        return;
      }
    }
    setSelectedPreset(undefined);
  };

  // const resetValues = (): void => {
  //   setRange(clearRange([]));
  //   !confirmationButtons && onUpdate?.(clearRange([]));
  // };

  useEffect(() => {
    if (confirmationButtons && isOpen) return;
    setRange(clearRange([controlledRange]));
  }, [controlledRange]);

  useEffect(() => {
    checkPreset();
  }, [range]);

  // Helper function to check if two date ranges are equal
  const areRangesEqual = (a?: DateRangeClean, b?: DateRangeClean): boolean => {
    if (!a || !b) return a === b; // If either is undefined, return true if both are undefined
    return (
      isEqual(startOfDay(a?.from ?? 0), startOfDay(b?.from ?? 0)) &&
      isEqual(startOfDay(a?.to ?? 0), startOfDay(b?.to ?? 0))
    );
  };

  const isDeafult = areRangesEqual(
    clearRange([range, controlledRange]),
    clearRange([initialRange]),
  );

  const onRangeSelected = (range: DateRangeClean): void => {
    setRange(range);
    // !confirmationButtons && onUpdate?.(range);
    !confirmationButtons &&
      onUpdate?.(
        undefinedOnDefault && areRangesEqual(range, clearRange([initialRange]))
          ? undefined
          : range,
      );
  };

  const setPreset = (preset: string): void => {
    const range = getPresetRange(preset);
    onRangeSelected(range);
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
        setIsOpen(open);
      }}
    >
      <PopoverTrigger asChild>
        <Button
          size={'sm'}
          variant="outline"
          className={cn('flex h-8 flex-row items-center gap-1 px-2', className)}
        >
          <CalendarIcon className="text-muted-foreground size-4 flex-shrink-0" />
          <div className="text-right">
            <div className={cn('py-1', isDeafult && 'text-muted-foreground')}>
              <div>{`${format(range?.from, 'dd.MM.yyyy')}${
                range?.to ? ' - ' + format(range?.to, 'dd.MM.yyyy') : ''
              }`}</div>
            </div>
          </div>

          <ChevronUpIcon
            className={cn(
              'text-muted-foreground size-5 flex-shrink-0 transition-transform',
              isOpen ? 'rotate-0' : 'rotate-180',
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent align={align} className="w-auto">
        <div className="flex ">
          <div className="flex ">
            <div className="flex flex-col ">
              <div className="flex flex-col items-center justify-end gap-2  px-3 pb-4 lg:flex-row lg:items-start lg:pb-0">
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <DateInput
                      value={range?.from}
                      onChange={(date) => {
                        const toDate =
                          !range?.to || (date && date > range.to)
                            ? date
                            : range.to;
                        onRangeSelected(
                          clearRange([{ from: date, to: toDate }]),
                        );
                      }}
                    />
                    {/* <DateInput2
                      value={range?.from}
                      onChange={(date) => {
                        const toDate =
                          !range?.to || (date && date > range.to)
                            ? date
                            : range.to;
                        onRangeSelected(
                          clearRange([{ from: date, to: toDate }]),
                        );
                      }}
                    /> */}
                    <div className="py-1">-</div>
                    <DateInput
                      value={range?.to}
                      onChange={(date) => {
                        const fromDate =
                          date && date < range.from ? date : range.from;
                        onRangeSelected(
                          clearRange([{ from: fromDate, to: date }]),
                        );
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
                      const range = clearRange([
                        { from: value.from, to: value?.to },
                      ]);
                      onRangeSelected(range);
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
            <div className="flex flex-col items-stretch gap-1 pb-2 pl-4 pr-2 text-left">
              {PRESETS.map((preset) => (
                <PresetButton
                  key={preset.name}
                  preset={preset.name}
                  label={preset.label}
                  isSelected={selectedPreset === preset.name}
                  setPreset={setPreset}
                />
              ))}
            </div>
          )}
        </div>
        {confirmationButtons && (
          <div className="flex justify-end gap-2 py-2 pr-4">
            <Button
              onClick={() => {
                setIsOpen(false);
                // resetValues();
              }}
              variant="ghost"
            >
              Отменить
            </Button>
            <Button
              onClick={() => {
                setIsOpen(false);
                if (!areRangesEqual(range, openedRangeRef.current)) {
                  onUpdate?.(
                    undefinedOnDefault && isDeafult ? undefined : range,
                  );
                }
              }}
            >
              Выбрать
            </Button>
          </div>
        )}
      </PopoverContent>
    </Popover>
  );
};

DateRangeSelectAdvanced.displayName = 'DateRangeSelectAdvanced';
