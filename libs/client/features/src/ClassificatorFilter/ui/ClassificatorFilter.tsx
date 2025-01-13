import { PlusCircleIcon, X } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Badge,
  Button,
  cn,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Skeleton,
} from '@urgp/client/shared';
import { StyleData } from '@urgp/client/entities';
import { ClassificatorCommand } from './ClassificatorCommand';

export type OptionVariant<TValue extends string | number> = {
  value: string;
  label: string;
  items: {
    value: TValue;
    label: string;
    category?: string;
    fullname?: string;
    tags?: string[];
  }[];
};

export interface ClassificatorFilterProps<TValue extends string | number>
  extends React.HTMLAttributes<HTMLDivElement> {
  options: OptionVariant<TValue>[];
  selectedValues?: TValue[];
  setSelectedValues: (value: TValue[]) => void;
  categoryStyles?: Record<string, StyleData>;
  valueStyles?: Record<TValue, StyleData>;
  variant?: 'popover' | 'checkbox';
  label?: string;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  className?: string;
  // triggerClassName?: string;
  popoverClassName?: string;
  iconClassName?: string;
  shortBadge?: boolean;
}

function ClassificatorFilter<TValue extends string | number>(
  props: ClassificatorFilterProps<TValue>,
): JSX.Element {
  const {
    options = [],
    isLoading = false,
    selectedValues = [],
    variant = 'popover',
    label = 'Значения',
    disabled,
    className,
    popoverClassName,
    shortBadge = false,
    setSelectedValues,
    // categoryStyles,
    // valueStyles,
    // placeholder = 'Поиск значения',
    // iconClassName,
  } = props;

  const flatOptions = useMemo(
    () => options.flatMap((option) => option.items),
    [options],
  );

  const [open, setOpen] = useState(false);

  if (isLoading) {
    return <Skeleton className={cn('h-10 w-full', className)} />;
  }

  if (variant === 'checkbox') {
    return (
      <div className="relative mb-2 flex w-full flex-col gap-1">
        <span className="w-full text-lg font-bold">{label}</span>
        {selectedValues.length > 0 && (
          <Button
            type="button"
            variant="outline"
            className="absolute right-0 top-1 h-6 rounded-full p-1 px-2"
            onClick={() => setSelectedValues([])}
          >
            <span>{selectedValues.length}</span>
            <X className="size-4 flex-shrink-0" />
          </Button>
        )}
        <ClassificatorCommand {...(props as any)} flatOptions={flatOptions} />
      </div>
    );
  }

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={disabled}
          variant="outline"
          size="sm"
          className={cn(
            'flex h-8 items-center justify-start border-dashed p-1',
            // triggerClassName,
            className,
          )}
        >
          <PlusCircleIcon className="mr-2 h-4 w-4 flex-shrink-0" />
          {label}
          {selectedValues?.length > 0 && (
            <>
              <Separator orientation="vertical" className="mx-2 ml-auto h-4" />
              <Badge
                variant="secondary"
                className="rounded-sm px-1 font-normal lg:hidden"
              >
                {selectedValues.length}
              </Badge>
              <div className="hidden space-x-1 lg:flex">
                {selectedValues.length > 2 || shortBadge ? (
                  <Badge
                    variant="secondary"
                    className="rounded-sm px-1 font-normal"
                  >
                    {selectedValues.length} выбрано
                  </Badge>
                ) : (
                  flatOptions
                    .filter((option) => selectedValues.includes(option.value))
                    .map((option) => (
                      <Badge
                        variant="secondary"
                        key={option.value}
                        className="rounded-sm px-1 font-normal"
                      >
                        {option.label}
                      </Badge>
                    ))
                )}
              </div>
            </>
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0', popoverClassName)} align="start">
        <ClassificatorCommand {...(props as any)} flatOptions={flatOptions} />
      </PopoverContent>
    </Popover>
  );
}

export { ClassificatorFilter };
