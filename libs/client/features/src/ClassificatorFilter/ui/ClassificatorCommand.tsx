import { CheckIcon, PlusCircleIcon } from 'lucide-react';
import { forwardRef, memo, useMemo, useState } from 'react';
import { Command as CommandPrimitive } from 'cmdk';
import {
  Badge,
  Button,
  Checkbox,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
  Skeleton,
} from '@urgp/client/shared';
import { StyleData } from '@urgp/client/entities';
import { ClassificatorFilterProps } from './ClassificatorFilter';

const ClassificatorCommand = forwardRef<
  React.ElementRef<typeof CommandPrimitive>,
  React.ComponentPropsWithoutRef<typeof CommandPrimitive> &
    ClassificatorFilterProps<string | number> & {
      flatOptions: {
        value: string | number;
        label: string;
        category?: string;
        fullname?: string;
        tags?: string[];
        count?: number;
      }[];
    }
>((props, ref) => {
  const {
    options = [],
    selectedValues = [],
    setSelectedValues,
    categoryStyles,
    categoryPropertyStyles,
    valueStyles,
    variant = 'popover',
    placeholder = 'Поиск значения',
    iconClassName,
    flatOptions,
    // isLoading = false,
    // label = 'Значения',
    // disabled,
    // className,
    // popoverClassName,
    // shortBadge = false,
  } = props;

  const [searchValue, setSearchValue] = useState('');

  const filteredOptions = useMemo(() => {
    return flatOptions.filter((option) => {
      const extendValue = (
        option.label +
        ' ' +
        option.tags?.join(' ')
      ).toLowerCase();
      if (extendValue.includes(searchValue.toLowerCase())) return 1;
      return 0;
    });
  }, [options, searchValue]);

  return (
    <Command
      ref={ref}
      filter={(value, search, keywords) => {
        const extendValue = (value + ' ' + keywords?.join(' ')).toLowerCase();
        if (extendValue.includes(search.toLowerCase())) return 1;
        return 0;
      }}
    >
      {flatOptions.length > 5 && (
        <div className="relative">
          <CommandInput
            value={searchValue}
            onValueChange={setSearchValue}
            placeholder={placeholder}
            className="pl-1"
          />
          <Checkbox
            className="bg-background absolute left-3 top-3 size-5"
            checked={
              filteredOptions.every((option) =>
                selectedValues.includes(option.value),
              )
                ? true
                : selectedValues.length > 0
                  ? 'indeterminate'
                  : false
            }
            onClick={
              selectedValues.length === flatOptions.length
                ? () => setSelectedValues([])
                : () =>
                    setSelectedValues(
                      flatOptions
                        .filter((option) => {
                          const extendValue = (
                            option.label +
                            ' ' +
                            option.tags?.join(' ')
                          ).toLowerCase();
                          if (extendValue.includes(searchValue.toLowerCase()))
                            return 1;
                          return 0;
                        })
                        .map((option) => option.value),
                    )
            }
          />
        </div>
      )}
      <CommandList
        className={cn(variant !== 'popover' ? 'max-h-full' : 'max-h-[400px]')}
      >
        <CommandEmpty>Не найдено</CommandEmpty>
        {variant !== 'popover' && <CommandItem value="-" className="hidden" />}
        {options.map((category) => {
          return (
            <CommandGroup
              key={category.value}
              heading={options.length < 2 ? undefined : category.label}
            >
              {category.items.map((option) => {
                const isSelected = selectedValues.includes(option.value);
                const { icon: ValueIcon, iconStyle } = valueStyles
                  ? valueStyles[option?.value] || Object.values(valueStyles)[0]
                  : categoryStyles
                    ? categoryStyles[category.value] ||
                      Object.values(categoryStyles)[0]
                    : categoryPropertyStyles && option?.category
                      ? categoryPropertyStyles[option.category] ||
                        Object.values(categoryPropertyStyles)[0]
                      : { icon: null, iconStyle: '+' };
                return (
                  <CommandItem
                    key={option.value}
                    keywords={option?.tags || []}
                    className="group/command-item relative"
                    onSelect={() => {
                      if (isSelected) {
                        setSelectedValues(
                          selectedValues.filter(
                            (value) => value !== option.value,
                          ),
                        );
                      } else {
                        setSelectedValues([...selectedValues, option.value]);
                      }
                    }}
                  >
                    <Button
                      type="button"
                      variant="ghost"
                      className="bg-accent text-muted-foreground hover:text-foreground absolute right-0 top-1/2 h-6 -translate-y-1/2 px-2 opacity-0 group-hover/command-item:opacity-100"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedValues([option.value]);
                      }}
                    >
                      только
                    </Button>
                    <div
                      className={cn(
                        'border-primary mr-2 flex h-4 w-4 items-center justify-center rounded-sm border',
                        isSelected
                          ? 'bg-primary text-primary-foreground'
                          : 'opacity-50 [&_svg]:invisible',
                      )}
                    >
                      <CheckIcon className={cn('h-4 w-4')} />
                    </div>
                    <span>{option.label}</span>
                    {ValueIcon && (
                      <ValueIcon
                        className={cn('ml-auto', iconClassName, iconStyle)}
                      />
                    )}
                    {option.count !== undefined && option.count > 0 && (
                      <Badge
                        variant="secondary"
                        className="border-muted-foreground/10 ml-2 rounded-sm px-1 font-normal"
                      >
                        {option.count}
                      </Badge>
                    )}
                  </CommandItem>
                );
              })}
            </CommandGroup>
          );
        })}
        {variant === 'popover' && selectedValues.length > 0 && (
          <div className="bg-background">
            <CommandSeparator />
            <CommandGroup>
              <CommandItem
                onSelect={() => setSelectedValues([])}
                className={cn('justify-center text-center')}
              >
                Сбросить фильтр
              </CommandItem>
            </CommandGroup>
          </div>
        )}
      </CommandList>
    </Command>
  );
});

export { ClassificatorCommand };
