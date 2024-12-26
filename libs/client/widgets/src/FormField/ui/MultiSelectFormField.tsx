import {
  Badge,
  cn,
  Command,
  CommandGroup,
  CommandItem,
  FormControl,
  FormField,
  FormItem,
} from '@urgp/client/shared';
import {
  ClassificatorInfo,
  NestedClassificatorInfo,
} from '@urgp/shared/entities';
import { UseFormReturn } from 'react-hook-form';
import { FormInputLabel } from './components/FormInputLabel';
import { FormInputSkeleton } from './components/FormInputSkeleton';
import { formFieldStatusClassName, formItemClassName } from './config/formItem';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { CommandList, Command as CommandPrimitive } from 'cmdk';

type MultiSelectFormFieldProps<T> = {
  fieldName: string;
  form: UseFormReturn<any, any>;
  options?: Array<NestedClassificatorInfo>;
  className?: string;
  triggerClassName?: string;
  popoverClassName?: string;
  isLoading?: boolean;
  label?: string | null;
  placeholder?: string;
  disabled?: boolean;
  addItemBadge?: (item: ClassificatorInfo | undefined) => JSX.Element | null;
  addBadgeStyle?: (item: ClassificatorInfo | undefined) => string | null;
  dirtyIndicator?: boolean;
};

const MultiSelectFormField = <T extends string | number>(
  props: MultiSelectFormFieldProps<T>,
): JSX.Element => {
  const {
    options = [],
    className,
    triggerClassName,
    popoverClassName,
    isLoading,
    form,
    fieldName,
    label = 'Значение',
    placeholder = 'Выберите значение',
    disabled = false,
    addItemBadge,
    addBadgeStyle,
    dirtyIndicator = false,
  } = props;

  const flatOptions = useMemo(
    () => options.flatMap((option) => option.items),
    [options],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [selected, setSelected] = useState<ClassificatorInfo[]>(
    flatOptions.filter((o) => form.getValues(fieldName)?.includes(o.value)) ||
      [],
  );
  const [inputValue, setInputValue] = useState('');

  const handleUnselect = useCallback((option: ClassificatorInfo) => {
    setSelected((prev) => prev.filter((s) => s.value !== option.value));
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      const input = inputRef.current;
      if (input) {
        if (e.key === 'Delete' || e.key === 'Backspace') {
          if (input.value === '') {
            setSelected((prev) => {
              const newSelected = [...prev];
              newSelected.pop();
              return newSelected;
            });
          }
        }
        // This is not a default behaviour of the <input /> field
        if (e.key === 'Escape') {
          input.blur();
        }
      }
    },
    [],
  );

  const selectables = options
    .map((nestedOption) => {
      return {
        ...nestedOption,
        items: nestedOption.items.filter(({ value }) => {
          return !selected?.some((o) => o.value === value);
        }),
      };
    })
    .filter((o) => o.items.length > 0);

  useEffect(() => {
    form.setValue(
      fieldName,
      selected.map((o) => o.value),
    );
  }, [form, fieldName, selected]);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState, formState }) => {
        return (
          <FormItem className={cn(formItemClassName, className)}>
            {label && <FormInputLabel fieldState={fieldState} label={label} />}
            {isLoading || !options ? (
              <FormInputSkeleton />
            ) : (
              <Command
                filter={(value, search, keywords) => {
                  const extendValue = (
                    keywords ? value + ' ' + keywords.join(' ') : value
                  ).toLowerCase();
                  if (extendValue.includes(search.toLowerCase())) return 1;
                  return 0;
                }}
                onKeyDown={handleKeyDown}
                className="overflow-visible bg-transparent"
              >
                <div
                  className={cn(
                    'border-input ring-offset-background focus-within:ring-ring group rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2',
                    formFieldStatusClassName({ dirtyIndicator, fieldState }),
                    triggerClassName,
                  )}
                >
                  <div className="flex flex-wrap gap-1">
                    {selected.map((option) => {
                      return (
                        <Badge
                          key={option.value}
                          variant="secondary"
                          className={cn(addBadgeStyle && addBadgeStyle(option))}
                        >
                          {option.label}
                          <button
                            className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
                            onKeyDown={(e) => {
                              if (e.key === 'Enter') {
                                handleUnselect(option);
                              }
                            }}
                            onMouseDown={(e) => {
                              e.preventDefault();
                              e.stopPropagation();
                            }}
                            onClick={() => handleUnselect(option)}
                          >
                            <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
                          </button>
                        </Badge>
                      );
                    })}
                    {/* Avoid having the "Search" Icon */}
                    <FormControl>
                      <CommandPrimitive.Input
                        ref={(e) => {
                          field.ref(e);
                          // @ts-expect-error oh boy
                          inputRef.current = e;
                        }}
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
                  <CommandList>
                    {open && selectables.length > 0 ? (
                      <div
                        className={cn(
                          'bg-popover text-popover-foreground animate-in absolute top-0 z-10 max-h-80 w-full overflow-auto rounded-md border shadow-md outline-none',
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
                                      setSelected((prev) => [...prev, option]);
                                    }}
                                    className={'cursor-pointer'}
                                    keywords={option.tags}
                                  >
                                    <p className="flex w-full flex-col gap-0 truncate">
                                      <span className="truncate">
                                        {option.label}
                                      </span>
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
                    ) : null}
                  </CommandList>
                </div>
              </Command>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export { MultiSelectFormField };
