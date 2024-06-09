import {
  Button,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@urgp/shared/ui';
import { cn, useDebounce } from '@urgp/shared/util';
import { Check, ChevronsUpDown } from 'lucide-react';
import { ReactNode, useState } from 'react';
import { useStreets } from '../api/streetsApi';

type StreetsComboboxFieldProps = {
  value: string;
  onSelect: (value: string) => void;

  unselectedPlaceholder?: string;
  searchPlaceholder?: string;
  emptySearchLabel?: ReactNode;

  className?: string;
};

function StreetsCombobox(props: StreetsComboboxFieldProps) {
  const {
    value,
    onSelect,
    unselectedPlaceholder = 'Выберете улицу',
    searchPlaceholder = 'Поиск...',
    emptySearchLabel = 'Улица не найдена',
    className,
  } = props;
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState<string>('');
  const debouncedQuery = useDebounce(query, 300);
  const { data: items } = useStreets(debouncedQuery, {
    skip: debouncedQuery === '' || !debouncedQuery || debouncedQuery.length < 3,
  });

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          className={cn(
            'justify-between',
            !value && 'text-muted-foreground',
            className,
          )}
        >
          <p className="truncate">
            {items && value
              ? items.find((item) => item.value === value)?.label
              : unselectedPlaceholder}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        className="p-0"
        side="bottom"
      >
        <Command className="max-h-72">
          <CommandInput
            placeholder={searchPlaceholder}
            onValueChange={(value) => {
              setQuery(value);
            }}
            value={query}
          />
          <CommandList>
            <CommandEmpty>
              {query && query.length > 3
                ? emptySearchLabel
                : 'Введите название для поиска...'}
            </CommandEmpty>
            {items &&
              query &&
              query.length > 3 &&
              items.map((item) => (
                <CommandItem
                  value={item.label}
                  key={item.value}
                  onSelect={() => {
                    setOpen(false);
                    setQuery('');
                    return onSelect(item.value);
                  }}
                >
                  <Check
                    className={cn(
                      'mr-2 h-4 w-4',
                      item.value === value ? 'opacity-100' : 'opacity-0',
                    )}
                  />
                  <p className="w-full truncate">{item.label}</p>
                </CommandItem>
              ))}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { StreetsCombobox };
