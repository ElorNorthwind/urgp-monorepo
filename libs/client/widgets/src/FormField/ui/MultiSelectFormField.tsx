import {
  Badge,
  cn,
  Command,
  CommandGroup,
  CommandItem,
  FormControl,
  FormField,
  FormItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@urgp/client/shared';
import {
  ClassificatorInfo,
  NestedClassificatorInfo,
} from '@urgp/shared/entities';
import { UseFormReturn } from 'react-hook-form';
import { FormInputLabel } from './components/FormInputLabel';
import { formFieldStatusClassName, formItemClassName } from './config/formItem';
import { useMemo, useRef, useState } from 'react';
import { X } from 'lucide-react';
import { CommandList, Command as CommandPrimitive } from 'cmdk';
import { InputSkeleton } from '@urgp/client/features';

type MultiSelectFormFieldProps<T> = {
  fieldName: string;
  form: UseFormReturn<any, any>;
  options?: Array<NestedClassificatorInfo>;
  className?: string;
  triggerClassName?: string;
  popoverMinWidth?: string;
  isLoading?: boolean;
  label?: string | null;
  placeholder?: string;
  disabled?: boolean;
  addItemBadge?: (item: ClassificatorInfo | undefined) => JSX.Element | null;
  addBadgeStyle?: (item: ClassificatorInfo | undefined) => string | null;
  dirtyIndicator?: boolean;
  side?: 'top' | 'right' | 'bottom' | 'left';
  extraButton?: () => JSX.Element | null;
  lockOption?: (option?: ClassificatorInfo) => boolean;
  hideOption?: (option?: ClassificatorInfo) => boolean;
};

const MultiSelectFormField = <T extends string | number>(
  props: MultiSelectFormFieldProps<T>,
): JSX.Element => {
  const {
    options = [],
    className,
    triggerClassName,
    popoverMinWidth,
    isLoading,
    form,
    fieldName,
    label = 'Значение',
    placeholder = 'Выберите значение',
    disabled = false,
    addItemBadge,
    addBadgeStyle,
    dirtyIndicator = false,
    extraButton,
    lockOption,
    hideOption,
  } = props;

  const flatOptions = useMemo(
    () => options.flatMap((option) => option.items),
    [options],
  );

  const inputRef = useRef<HTMLInputElement>(null);
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState, formState }) => {
        const selectables = options
          .map((nestedOption) => {
            return {
              ...nestedOption,
              items: nestedOption.items
                .filter(({ value }) => {
                  return !field.value?.some((v: number) => v === value);
                })
                .filter((o) => (lockOption ? !lockOption(o) : true))
                .filter((o) => (hideOption ? !hideOption(o) : true)),
            };
          })
          .filter((o) => o.items.length > 0);

        return (
          <FormItem className={cn(formItemClassName, className)}>
            {label && <FormInputLabel fieldState={fieldState} label={label} />}
            {isLoading || !options ? (
              <InputSkeleton />
            ) : (
              <Popover open={open}>
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
                        if (
                          !lockOption ||
                          !lockOption(
                            flatOptions.find(
                              (o) =>
                                o.value === field.value[field.value.length - 1],
                            ),
                          )
                        ) {
                          field.onChange([...(field.value.slice(0, -1) || [])]);
                        } else if (!!lockOption) {
                          const removedIndex = field.value.findLastIndex(
                            (v: number) =>
                              !lockOption(
                                flatOptions.find((o) => v === o.value),
                              ),
                          );
                          return (
                            removedIndex >= 0 &&
                            field.onChange([
                              ...field.value.slice(0, removedIndex),
                              ...field.value.slice(removedIndex + 1),
                            ])
                          );
                        }
                      }
                    }
                    // This is not a default behaviour of the <input /> field
                    if (e.key === 'Escape') {
                      inputRef.current?.blur();
                    }
                  }}
                  className="overflow-visible bg-transparent"
                  onFocus={() => {
                    inputRef.current?.focus();
                    setOpen(true);
                  }}
                  onBlur={() => setOpen(false)}
                >
                  <PopoverTrigger asChild>
                    <div
                      className={cn(
                        'bg-background min-h-10',
                        'border-input ring-offset-background focus-within:ring-ring group rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2',
                        formFieldStatusClassName({
                          dirtyIndicator,
                          fieldState,
                        }),
                        triggerClassName,
                      )}
                    >
                      <div className="flex flex-wrap gap-1">
                        {field.value?.map((option: number) => {
                          const locked =
                            (lockOption &&
                              lockOption(
                                flatOptions.find((o) => o.value === option),
                              )) ??
                            false;

                          return (
                            <Badge
                              key={option}
                              variant="secondary"
                              className={cn(
                                'h-[1.3rem]',
                                addBadgeStyle &&
                                  addBadgeStyle(
                                    flatOptions.find((o) => o.value === option),
                                  ),
                                locked &&
                                  'bg-muted-foreground/10 cursor-not-allowed',
                              )}
                            >
                              {
                                flatOptions.find((o) => o.value === option)
                                  ?.label
                              }
                              <button
                                disabled={locked}
                                tabIndex={-1}
                                className={cn(
                                  'ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2',
                                  locked && 'hidden',
                                )}
                                onKeyDown={(e) => {
                                  if (e.key === 'Enter') {
                                    field.onChange(
                                      field.value.filter(
                                        (v: number) => v !== option,
                                      ),
                                    );
                                  }
                                }}
                                onMouseDown={(e) => {
                                  e.preventDefault();
                                  e.stopPropagation();
                                }}
                                onClick={() =>
                                  field.onChange(
                                    field.value.filter(
                                      (o: number) => o !== option,
                                    ),
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
                            ref={(e) => {
                              field.ref(e);
                              // @ts-expect-error oh boy
                              inputRef.current = e;
                            }}
                            value={inputValue}
                            disabled={disabled}
                            onValueChange={setInputValue}
                            // onBlur={() => setOpen(false)}
                            // onFocus={() => setOpen(true)}
                            placeholder={
                              field?.value?.length > 0
                                ? ''
                                : placeholder || 'Выберите значение'
                            }
                            className="placeholder:text-muted-foreground ml-2 flex-1 truncate bg-transparent outline-none"
                          />
                        </FormControl>
                      </div>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent
                    sideOffset={8}
                    className={cn('p-0')} // popoverClassName
                    side="bottom"
                    style={{
                      // width: 'calc(600px - 3rem)',
                      minWidth: popoverMinWidth,
                      // minWidth: '600px',
                    }}

                    // className={cn(
                    //   'bg-popover text-popover-foreground animate-in top-0 z-10 max-h-80 w-full overflow-auto rounded-md border shadow-md outline-none',
                    //   open && selectables.length > 0 ? 'absolute' : 'hidden',
                    // )}
                  >
                    <CommandList
                      className="max-h-80 overflow-auto"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      {selectables.map((category) => {
                        return (
                          <CommandGroup
                            key={category.value}
                            heading={category.label}
                            className="h-full overflow-auto"
                          >
                            {category.items.map((option) => {
                              // if (lockOption && lockOption(option)) return null;
                              return (
                                <CommandItem
                                  key={option.value}
                                  onMouseDown={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                  }}
                                  onSelect={() => {
                                    setInputValue('');
                                    field.onChange([
                                      ...field.value,
                                      option.value,
                                    ]);
                                  }}
                                  className={cn('cursor-pointer')}
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
                      {extraButton && (
                        <>
                          <Separator />
                          {extraButton()}
                        </>
                      )}
                    </CommandList>
                  </PopoverContent>
                </Command>
              </Popover>
            )}
          </FormItem>
        );
      }}
    />
  );
};

export { MultiSelectFormField };
