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
  FormLabel,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from '@urgp/client/shared';
import { NestedClassificatorInfo } from '@urgp/shared/entities';
import { Check, ChevronsUpDown, Coffee } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type ClassificatorFormFieldSelectorProps = {
  form: UseFormReturn<any, any>;
  fieldName: string;
  classificator?: NestedClassificatorInfo[];
  className?: string;
  popoverClassName?: string;
  isLoading?: boolean;
  label?: string;
};

const ClassificatorFormFieldSelector = (
  props: ClassificatorFormFieldSelectorProps,
): JSX.Element => {
  const {
    classificator,
    className,
    popoverClassName,
    isLoading,
    label,
    form,
    fieldName,
  } = props;

  return (
    <FormField
      control={form.control}
      name={fieldName}
      render={({ field }) => (
        <FormItem className="grid">
          <FormLabel className="text-left">
            <p className="flex justify-between truncate">
              <span>{label || 'Выбор'}</span>
              <span className="flex-grow truncate text-right text-xs font-light text-rose-500">
                {form.formState?.errors?.[fieldName] &&
                  form.formState.errors[fieldName].message?.toString()}
              </span>
            </p>
          </FormLabel>
          {isLoading || !classificator ? (
            <Skeleton className="h-8 w-full" />
          ) : (
            <Popover>
              <PopoverTrigger asChild>
                <FormControl>
                  <Button
                    variant="outline"
                    role="combobox"
                    className={cn(
                      'w-full justify-between overflow-hidden',
                      !field.value && 'text-muted-foreground',
                      className,
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
                      </div>
                    ) : (
                      'Не выбрано'
                    )}
                    <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                  </Button>
                </FormControl>
              </PopoverTrigger>
              <PopoverContent
                className={cn('p-0', popoverClassName)} // НАДО ЧТО ТО ПРИДУМАТЬ
                side="top"
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
                    {classificator.map((category) => {
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
                                  form.setValue(fieldName, item.value);
                                }}
                              >
                                <Check
                                  className={cn(
                                    'mr-2 h-4 w-4',
                                    item.value === field.value
                                      ? 'opacity-100'
                                      : 'opacity-0',
                                  )}
                                />
                                <p className="flex w-full flex-col gap-0 truncate">
                                  <span className="truncate">{item.label}</span>
                                  <span className="text-muted-foreground/60 truncate text-xs">
                                    {item.fullname}
                                  </span>
                                </p>
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

export { ClassificatorFormFieldSelector };
