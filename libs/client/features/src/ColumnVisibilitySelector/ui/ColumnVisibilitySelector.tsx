import { CheckIcon, Settings2 } from 'lucide-react';
import { Dispatch, useState } from 'react';
import {
  Button,
  cn,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Skeleton,
} from '@urgp/client/shared';
import { VisibilityState } from '@tanstack/react-table';

interface ColumnVisibilitySelectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  columnNames?: Record<string, string>;
  columnVisibility?: VisibilityState;
  setColumnVisibility: Dispatch<VisibilityState>;
  isLoading?: boolean;
  className?: string;
}

function ColumnVisibilitySelector(
  props: ColumnVisibilitySelectorProps,
): JSX.Element {
  const {
    columnNames,
    columnVisibility,
    setColumnVisibility,
    isLoading,
    className,
  } = props;
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');

  if (isLoading) {
    return <Skeleton className={cn('h-10 w-full', className)} />;
  }

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          disabled={isLoading}
          variant="outline"
          className={cn('size-8 shrink-0 p-1', className)}
        >
          <Settings2 className="size-4" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className={cn('p-0')} align="end" side="bottom">
        <Command>
          {Object.keys(columnVisibility || {}).length > 5 && (
            <CommandInput
              value={searchValue}
              onValueChange={setSearchValue}
              placeholder={'Поиск столбцов'}
              className="pl-1"
            />
          )}
          <CommandList>
            <CommandEmpty>Не найдено</CommandEmpty>
            {Object.keys(columnVisibility || {}).map((column) => {
              const isSelected = columnVisibility?.[column];
              return (
                <CommandItem
                  key={column}
                  className="group/command-item relative"
                  onSelect={() => {
                    if (isSelected) {
                      setColumnVisibility({
                        ...columnVisibility,
                        [column]: false,
                      });
                    } else {
                      setColumnVisibility({
                        ...columnVisibility,
                        [column]: true,
                      });
                    }
                  }}
                >
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
                  <span>{columnNames?.[column] || column}</span>
                </CommandItem>
              );
            })}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { ColumnVisibilitySelector };
