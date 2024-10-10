import { cn } from '../../lib/cn';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from './command';
import { ReactNode, useState } from 'react';

type ListItem<T> = {
  value: T;
  label: string;

  // icon?: ReactNode; // to do - add something like that I guess

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [x: string]: any;
};

type ComboboxFieldProps<T> = {
  items: ListItem<T>[];
  value: string;
  onSelect: (value: string) => void;
  side?: 'top' | 'right' | 'bottom' | 'left';

  unselectedPlaceholder?: string;
  searchPlaceholder?: string;
  emptySearchLabel?: ReactNode;

  className?: string;
};

function Combobox<T>(props: ComboboxFieldProps<T>) {
  const {
    items,
    value,
    onSelect,
    unselectedPlaceholder = 'Выберете из списка',
    searchPlaceholder = 'Найти...',
    emptySearchLabel = 'Ничего не найдено.',
    className,
    side,
  } = props;
  const [open, setOpen] = useState(false);

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
            {value
              ? items.find((item) => item.value === value)?.label
              : unselectedPlaceholder}
          </p>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent
        style={{ width: 'var(--radix-popover-trigger-width)' }}
        className="p-0"
        side={side}
      >
        <Command>
          <CommandInput placeholder={searchPlaceholder} />
          <CommandList>
            <CommandEmpty>{emptySearchLabel}</CommandEmpty>
            <CommandGroup>
              {items.map((item) => (
                <CommandItem
                  value={item.label}
                  key={item.value.toString()}
                  onSelect={() => {
                    setOpen(false);
                    return onSelect(item.value.toString());
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
            </CommandGroup>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { Combobox };
