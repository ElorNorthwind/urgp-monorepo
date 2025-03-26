import {
  Badge,
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  FormControl,
  FormField,
  FormItem,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@urgp/client/shared';
import { NestedClassificatorInfo } from '@urgp/shared/entities';
import { Check, ChevronsUpDown } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { FormInputLabel } from './components/FormInputLabel';
import { formFieldStatusClassName, formItemClassName } from './config/formItem';
import { useState } from 'react';
import { InputSkeleton } from '@urgp/client/features';

type ClassificatorFormFieldProps = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  classificator?: NestedClassificatorInfo[];
  className?: string;
  triggerClassName?: string;
  popoverMinWidth?: string;
  label?: string | null;
  placeholder?: string;
  isLoading?: boolean;
  disabled?: boolean;
  addItemBadge?: (
    item: NestedClassificatorInfo['items'][0] | undefined,
  ) => JSX.Element | null;
  dirtyIndicator?: boolean;
};

const ClassificatorFormField = (
  props: ClassificatorFormFieldProps,
): JSX.Element => {
  const {
    classificator,
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
    dirtyIndicator = false,
  } = props;
  const [open, setOpen] = useState(false);

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field, fieldState, formState }) => (
        <FormItem
          className={cn(
            'group',
            // 'focus-within:ring-ring focus-within:ring-2 focus-within:ring-offset-2',
            formItemClassName,
            className,
          )}
        >
          {label && <FormInputLabel fieldState={fieldState} label={label} />}
          {isLoading || !classificator ? (
            <InputSkeleton />
          ) : (
            <Popover open={open} onOpenChange={setOpen}>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    name={field.name}
                    variant="outline"
                    disabled={disabled || formState.isSubmitting}
                    role="combobox"
                    ref={field.ref}
                    className={cn(
                      'group-focus-within:ring-ring group-focus-within:ring-2 group-focus-within:ring-offset-2',
                      'w-full justify-between overflow-hidden',
                      formFieldStatusClassName({ dirtyIndicator, fieldState }),
                      !field.value && 'text-muted-foreground',
                      triggerClassName,
                    )}
                  >
                    {field.value ? (
                      <div className="-ml-1 flex w-[calc(100%-1.5rem)] items-center justify-start gap-2">
                        {classificator.length > 1 && (
                          <Badge variant={'outline'}>
                            {
                              classificator.find((category) =>
                                category.items.some(
                                  (item) => field.value === item.value,
                                ),
                              )?.label
                            }
                          </Badge>
                        )}
                        <p className="truncate">
                          {
                            classificator
                              .find((category) =>
                                category.items.some(
                                  (item) => field.value === item.value,
                                ),
                              )
                              ?.items.find((item) => item.value === field.value)
                              ?.label
                          }
                        </p>
                        {addItemBadge && (
                          <p className="ml-auto">
                            {addItemBadge(
                              classificator
                                .find((category) =>
                                  category.items.some(
                                    (item) => field.value === item.value,
                                  ),
                                )
                                ?.items.find(
                                  (item) => item.value === field.value,
                                ),
                            )}
                          </p>
                        )}
                      </div>
                    ) : (
                      placeholder
                    )}
                    <ChevronsUpDown className="ml-2 size-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className={cn('p-0')} // popoverClassName
                side="bottom"
                style={{
                  // width: 'calc(600px - 3rem)',
                  minWidth: popoverMinWidth,
                }}
              >
                <Command
                  filter={(value, search, keywords) => {
                    const extendValue = (
                      keywords ? value + ' ' + keywords.join(' ') : value
                    ).toLowerCase();
                    if (extendValue.includes(search.toLowerCase())) return 1;
                    return 0;
                  }}
                >
                  <CommandInput placeholder="Поиск значения..." />
                  <CommandList>
                    <CommandEmpty>Ничего не найдено.</CommandEmpty>
                    {classificator
                      .filter((c) => c?.items?.length && c?.items?.length > 0)
                      .map((category) => {
                        return (
                          <CommandGroup
                            key={category.value}
                            heading={category.label}
                          >
                            {category.items.map((item) => {
                              return (
                                <CommandItem
                                  value={item.label}
                                  key={item.value}
                                  keywords={item.tags}
                                  onSelect={() => {
                                    setOpen(false);
                                    field.onChange(item.value);
                                  }}
                                >
                                  <Check
                                    className={cn(
                                      'mr-2 size-4',
                                      item.value === field.value
                                        ? 'opacity-100'
                                        : 'opacity-0',
                                    )}
                                  />
                                  <p className="flex w-full flex-col gap-0 truncate">
                                    <span className="truncate">
                                      {item.label}
                                    </span>
                                    <span className="text-muted-foreground/60 truncate text-xs">
                                      {item.fullname}
                                    </span>
                                  </p>
                                  {addItemBadge && addItemBadge(item)}
                                </CommandItem>
                              );
                            })}
                          </CommandGroup>
                        );
                      })}
                  </CommandList>
                </Command>
              </PopoverContent>
            </Popover>
          )}
        </FormItem>
      )}
    />
  );
};

export { ClassificatorFormField };
