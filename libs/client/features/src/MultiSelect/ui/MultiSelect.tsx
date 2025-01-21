import {
  Badge,
  cn,
  Command,
  CommandGroup,
  CommandItem,
  FormControl,
  Label,
} from '@urgp/client/shared';
import {
  ClassificatorInfo,
  NestedClassificatorInfo,
} from '@urgp/shared/entities';
import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { CommandList, Command as CommandPrimitive } from 'cmdk';
import { InputSkeleton } from '../../InputSkeleton';

type MultiSelectProps<T> = {
  selectedValues: Array<T>;
  setSelectedValues: (value: Array<T>) => void;
  options?: Array<NestedClassificatorInfo>;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  isLoading?: boolean;
  label?: string | JSX.Element | null;
  placeholder?: string;
  disabled?: boolean;
  addItemBadge?: (item: ClassificatorInfo | undefined) => JSX.Element | null;
  addBadgeStyle?: (item: ClassificatorInfo | undefined) => string | null;
};

const MultiSelect = <T extends string | number>(
  props: MultiSelectProps<T>,
): JSX.Element => {
  const {
    selectedValues,
    setSelectedValues,
    options = [],
    className,
    triggerClassName,
    popoverClassName,
    isLoading,
    label = 'Значение',
    placeholder = 'Выберите значение',
    disabled = false,
    addItemBadge,
    addBadgeStyle,
  } = props;

  const flatOptions = useMemo(
    () => options.flatMap((option) => option.items),
    [options],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  const selectables = options
    .map((nestedOption) => {
      return {
        ...nestedOption,
        items: nestedOption.items.filter(({ value }) => {
          return !selectedValues?.some((v: T) => v === value);
        }),
      };
    })
    .filter((o) => o.items.length > 0);

  return (
    <div className={cn(className)}>
      {label && typeof label === 'string' ? <Label>{label}</Label> : label}
      {isLoading || !options ? (
        <InputSkeleton />
      ) : (
        <Command
          filter={(value, search, keywords) => {
            const extendValue = (
              keywords ? value + ' ' + keywords.join(' ') : value
            ).toLowerCase();
            if (extendValue.includes(search.toLowerCase())) return 1;
            return 0;
          }}
          onKeyDown={(e) => {
            if (e.key === 'Delete' || e.key === 'Backspace') {
              if (inputValue === '') {
                setSelectedValues([...(selectedValues.slice(0, -1) || [])]);
              }
            }
            // This is not a default behaviour of the <input /> field
            if (e.key === 'Escape') {
              inputRef.current?.blur();
            }
          }}
          className="overflow-visible bg-transparent"
        >
          <div
            className={cn(
              'border-input ring-offset-background focus-within:ring-ring group rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2',
              triggerClassName,
            )}
          >
            <div className="flex flex-wrap gap-1">
              {selectedValues?.map((option: T) => {
                return (
                  <Badge
                    key={option}
                    variant="secondary"
                    className={cn(
                      addBadgeStyle &&
                        addBadgeStyle(
                          flatOptions.find((o) => o.value === option),
                        ),
                    )}
                  >
                    {flatOptions.find((o) => o.value === option)?.label}
                    <button
                      tabIndex={-1}
                      className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') {
                          setSelectedValues(
                            selectedValues.filter((v: T) => v !== option),
                          );
                        }
                      }}
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                      onClick={() =>
                        setSelectedValues(
                          selectedValues.filter((o: T) => o !== option),
                        )
                      }
                    >
                      <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                    </button>
                  </Badge>
                );
              })}
              {/* Avoid having the "Search" Icon */}
              <FormControl>
                <CommandPrimitive.Input
                  // ref={(e) => {
                  //   ref(e);
                  //   // @ts-expect-error oh boy
                  //   inputRef.current = e;
                  // }}
                  ref={inputRef}
                  value={inputValue}
                  disabled={disabled}
                  onValueChange={setInputValue}
                  onBlur={() => setOpen(false)}
                  onFocus={() => setOpen(true)}
                  placeholder={placeholder || 'Выберите значение'}
                  className="placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none"
                />
              </FormControl>
            </div>
          </div>
          <div className="relative mt-2">
            <CommandList
              onMouseDown={(e) => {
                e.preventDefault();
                e.stopPropagation();
              }}
            >
              <div
                className={cn(
                  'bg-popover text-popover-foreground animate-in top-0 z-10 max-h-80 w-full overflow-auto rounded-md border shadow-md outline-none',
                  open && selectables.length > 0 ? 'absolute' : 'hidden',
                  popoverClassName,
                )}
              >
                {selectables.map((category) => {
                  return (
                    <CommandGroup
                      key={category.value}
                      heading={category.label}
                      className="h-full overflow-auto"
                    >
                      {category.items.map((option) => {
                        return (
                          <CommandItem
                            key={option.value}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onSelect={() => {
                              setInputValue('');
                              setSelectedValues([
                                ...selectedValues,
                                option.value as T,
                              ]);
                            }}
                            className={'cursor-pointer'}
                            keywords={option.tags}
                          >
                            <p className="flex w-full flex-col gap-0 truncate">
                              <span className="truncate">{option.label}</span>
                              <span className="text-muted-foreground/60 truncate text-xs">
                                {option.fullname}
                              </span>
                            </p>
                            {addItemBadge && addItemBadge(option)}
                          </CommandItem>
                        );
                      })}
                    </CommandGroup>
                  );
                })}
              </div>
            </CommandList>
          </div>
        </Command>
      )}
    </div>
  );
};

export { MultiSelect };
