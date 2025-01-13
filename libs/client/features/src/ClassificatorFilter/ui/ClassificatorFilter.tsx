import { CheckIcon, PlusCircleIcon } from 'lucide-react';
import { useMemo, useState } from 'react';
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

// type MultiSelectFormFieldProps<T> = {
//   fieldName: string;
//   form: UseFormReturn<any, any>;
//   options?: Array<NestedClassificatorInfo>;
//   className?: string;
//   triggerClassName?: string;
//   popoverClassName?: string;
//   isLoading?: boolean;
//   label?: string | null;
//   placeholder?: string;
//   disabled?: boolean;
//   addItemBadge?: (item: ClassificatorInfo | undefined) => JSX.Element | null;
//   addBadgeStyle?: (item: ClassificatorInfo | undefined) => string | null;
//   dirtyIndicator?: boolean;
// };

// const MultiSelectFormField = <T extends string | number>(
//   props: MultiSelectFormFieldProps<T>,
// ): JSX.Element => {
//   const {
//     options = [],
//     className,
//     triggerClassName,
//     popoverClassName,
//     isLoading,
//     form,
//     fieldName,
//     label = 'Значение',
//     placeholder = 'Выберите значение',
//     disabled = false,
//     addItemBadge,
//     addBadgeStyle,
//     dirtyIndicator = false,
//   } = props;

//   const flatOptions = useMemo(
//     () => options.flatMap((option) => option.items),
//     [options],
//   );

//   const inputRef = useRef<HTMLInputElement>(null);
//   const [open, setOpen] = useState(false);
//   const [inputValue, setInputValue] = useState('');

//   return (
//     <FormField
//       control={form.control}
//       name={fieldName}
//       render={({ field, fieldState, formState }) => {
//         const selectables = options
//           .map((nestedOption) => {
//             return {
//               ...nestedOption,
//               items: nestedOption.items.filter(({ value }) => {
//                 return !field.value?.some((v: number) => v === value);
//               }),
//             };
//           })
//           .filter((o) => o.items.length > 0);

//         return (
//           <FormItem className={cn(formItemClassName, className)}>
//             {label && <FormInputLabel fieldState={fieldState} label={label} />}
//             {isLoading || !options ? (
//               <FormInputSkeleton />
//             ) : (
//               <Command
//                 filter={(value, search, keywords) => {
//                   const extendValue = (
//                     keywords ? value + ' ' + keywords.join(' ') : value
//                   ).toLowerCase();
//                   if (extendValue.includes(search.toLowerCase())) return 1;
//                   return 0;
//                 }}
//                 onKeyDown={(e) => {
//                   if (e.key === 'Delete' || e.key === 'Backspace') {
//                     if (inputValue === '') {
//                       field.onChange([...(field.value.slice(0, -1) || [])]);
//                     }
//                   }
//                   // This is not a default behaviour of the <input /> field
//                   if (e.key === 'Escape') {
//                     inputRef.current?.blur();
//                   }
//                 }}
//                 className="overflow-visible bg-transparent"
//               >
//                 <div
//                   className={cn(
//                     'border-input ring-offset-background focus-within:ring-ring group rounded-md border px-3 py-2 text-sm focus-within:ring-2 focus-within:ring-offset-2',
//                     formFieldStatusClassName({ dirtyIndicator, fieldState }),
//                     triggerClassName,
//                   )}
//                 >
//                   <div className="flex flex-wrap gap-1">
//                     {field.value?.map((option: number) => {
//                       return (
//                         <Badge
//                           key={option}
//                           variant="secondary"
//                           className={cn(
//                             addBadgeStyle &&
//                               addBadgeStyle(
//                                 flatOptions.find((o) => o.value === option),
//                               ),
//                           )}
//                         >
//                           {flatOptions.find((o) => o.value === option)?.label}
//                           <button
//                             tabIndex={-1}
//                             className="ring-offset-background focus:ring-ring ml-1 rounded-full outline-none focus:ring-2 focus:ring-offset-2"
//                             onKeyDown={(e) => {
//                               if (e.key === 'Enter') {
//                                 field.onChange(
//                                   field.value.filter(
//                                     (v: number) => v !== option,
//                                   ),
//                                 );
//                               }
//                             }}
//                             onMouseDown={(e) => {
//                               e.preventDefault();
//                               e.stopPropagation();
//                             }}
//                             onClick={() =>
//                               field.onChange(
//                                 field.value.filter((o: number) => o !== option),
//                               )
//                             }
//                           >
//                             <X className="text-muted-foreground hover:text-foreground h-3 w-3" />
//                           </button>
//                         </Badge>
//                       );
//                     })}
//                     {/* Avoid having the "Search" Icon */}
//                     <FormControl>
//                       <CommandPrimitive.Input
//                         ref={(e) => {
//                           field.ref(e);
//                           // @ts-expect-error oh boy
//                           inputRef.current = e;
//                         }}
//                         value={inputValue}
//                         disabled={disabled}
//                         onValueChange={setInputValue}
//                         onBlur={() => setOpen(false)}
//                         onFocus={() => setOpen(true)}
//                         placeholder={placeholder || 'Выберите значение'}
//                         className="placeholder:text-muted-foreground ml-2 flex-1 bg-transparent outline-none"
//                       />
//                     </FormControl>
//                   </div>
//                 </div>
//                 <div className="relative mt-2">
//                   <CommandList>
//                     <div
//                       className={cn(
//                         'bg-popover text-popover-foreground animate-in top-0 z-10 max-h-80 w-full overflow-auto rounded-md border shadow-md outline-none',
//                         open && selectables.length > 0 ? 'absolute' : 'hidden',
//                         popoverClassName,
//                       )}
//                     >
//                       {selectables.map((category) => {
//                         return (
//                           <CommandGroup
//                             key={category.value}
//                             heading={category.label}
//                             className="h-full overflow-auto"
//                           >
//                             {category.items.map((option) => {
//                               return (
//                                 <CommandItem
//                                   key={option.value}
//                                   onMouseDown={(e) => {
//                                     e.preventDefault();
//                                     e.stopPropagation();
//                                   }}
//                                   onSelect={() => {
//                                     setInputValue('');
//                                     field.onChange([
//                                       ...field.value,
//                                       option.value,
//                                     ]);
//                                   }}
//                                   className={'cursor-pointer'}
//                                   keywords={option.tags}
//                                 >
//                                   <p className="flex w-full flex-col gap-0 truncate">
//                                     <span className="truncate">
//                                       {option.label}
//                                     </span>
//                                     <span className="text-muted-foreground/60 truncate text-xs">
//                                       {option.fullname}
//                                     </span>
//                                   </p>
//                                   {addItemBadge && addItemBadge(option)}
//                                 </CommandItem>
//                               );
//                             })}
//                           </CommandGroup>
//                         );
//                       })}
//                     </div>
//                   </CommandList>
//                 </div>
//               </Command>
//             )}
//           </FormItem>
//         );
//       }}
//     />
//   );
// };

// export { MultiSelectFormField };

type OptionVariant<TValue extends string | number> = {
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

interface ClassificatorFilterProps<TValue extends string | number>
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
  triggerClassName?: string;
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
    setSelectedValues,
    categoryStyles,
    valueStyles,
    variant = 'popover',
    label = 'Значения',
    disabled,
    placeholder = 'Поиск значения',
    className,
    triggerClassName,
    popoverClassName,
    iconClassName,
    shortBadge = false,
  } = props;

  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  const flatOptions = useMemo(
    () => options.flatMap((option) => option.items),
    [options],
  );

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

  // const taggedGroups = useMemo(() => {
  //   return groups.map((group) => ({
  //     ...group,
  //     items: group.items.map((item) => ({ ...item, keyword: group.label })),
  //   }));
  // }, [groups]);
  if (isLoading) {
    return <Skeleton className={cn('h-10 w-full', className)} />;
  }

  return (
    <div className={cn('', className)}>
      <Popover modal={true} open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button
            disabled={disabled}
            variant="outline"
            size="sm"
            className={cn(
              'flex h-8 items-center justify-start border-dashed p-1',
              triggerClassName,
            )}
          >
            <PlusCircleIcon className="mr-2 h-4 w-4 flex-shrink-0" />
            {label}
            {selectedValues?.length > 0 && (
              <>
                <Separator
                  orientation="vertical"
                  className="mx-2 ml-auto h-4"
                />
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
          <Command
            filter={(value, search, keywords) => {
              const extendValue = (
                value +
                ' ' +
                keywords?.join(' ')
              ).toLowerCase();
              if (extendValue.includes(search.toLowerCase())) return 1;
              return 0;
            }}
          >
            {flatOptions.length > 5 && (
              <>
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
                                if (
                                  extendValue.includes(
                                    searchValue.toLowerCase(),
                                  )
                                )
                                  return 1;
                                return 0;
                              })
                              .map((option) => option.value),
                          )
                  }
                />
              </>
            )}
            <CommandList>
              <CommandEmpty>Не найдено</CommandEmpty>
              {options.map((category) => {
                return (
                  <CommandGroup
                    key={category.value}
                    heading={options.length < 2 ? undefined : category.label}
                  >
                    {category.items.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      const { icon: ValueIcon, iconStyle } = valueStyles
                        ? valueStyles[option?.value] ||
                          Object.values(valueStyles)[0]
                        : categoryStyles
                          ? categoryStyles[category.value] ||
                            Object.values(categoryStyles)[0]
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
                              setSelectedValues([
                                ...selectedValues,
                                option.value,
                              ]);
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
                              className={cn(
                                'ml-auto',
                                iconClassName,
                                iconStyle,
                              )}
                            />
                          )}
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                );
              })}
              {selectedValues.length > 0 && (
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
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { ClassificatorFilter };
