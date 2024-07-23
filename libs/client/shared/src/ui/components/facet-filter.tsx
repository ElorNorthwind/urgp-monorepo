import { CheckIcon, LucideProps, PlusCircleIcon } from 'lucide-react';
import { cn } from '../../lib/cn';
import { Popover, PopoverContent, PopoverTrigger } from './popover';
import { Button } from './button';
import { Separator } from './separator';
import { Badge } from './badge';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from './command';

type Option<TValue extends string | number> = {
  value: TValue;
  label: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  className?: string;
};
interface FacetFilterProps<TValue extends string | number>
  extends React.HTMLAttributes<HTMLDivElement> {
  options: Option<TValue>[];
  selectedValues?: TValue[];
  setSelectedValues: (value: TValue[]) => void;
  title?: string;
  optionsWidth?: number;
  noSearch?: boolean;
}

function FacetFilter<TValue extends string | number>(
  props: FacetFilterProps<TValue>,
): JSX.Element {
  const {
    options,
    selectedValues = [],
    className,
    title,
    setSelectedValues,
    optionsWidth = 200,
    noSearch = false,
  } = props;

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="h-8 border-dashed">
            <PlusCircleIcon className="mr-2 h-4 w-4" />
            {title}
            {selectedValues?.length > 0 && (
              <>
                <Separator orientation="vertical" className="mx-2 h-4" />
                <Badge
                  variant="secondary"
                  className="rounded-sm px-1 font-normal lg:hidden"
                >
                  {selectedValues.length}
                </Badge>
                <div className="hidden space-x-1 lg:flex">
                  {selectedValues.length > 2 ? (
                    <Badge
                      variant="secondary"
                      className="rounded-sm px-1 font-normal"
                    >
                      {selectedValues.length} выбрано
                    </Badge>
                  ) : (
                    options
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
        <PopoverContent
          className="p-0"
          align="start"
          style={{ minWidth: optionsWidth }}
        >
          <Command>
            {!noSearch && <CommandInput placeholder={title} />}
            <CommandList>
              <CommandEmpty>Не найдено.</CommandEmpty>
              <CommandGroup>
                {options.map((option) => {
                  const isSelected = selectedValues.includes(option.value);
                  return (
                    <CommandItem
                      key={option.value}
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
                        // const filterValues = Array.from(selectedValues);
                        // column?.setFilterValue(
                        //   filterValues.length ? filterValues : undefined,
                        // );
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
                      {option.icon && (
                        <option.icon
                          className={cn(
                            'text-muted-foreground mr-2 h-4 w-4',
                            option.className,
                          )}
                        />
                      )}
                      <span>{option.label}</span>
                      {/* {facets?.get(option.value) && (
                          <span className="ml-auto flex h-4 w-4 items-center justify-center font-mono text-xs">
                            {facets.get(option.value)}
                          </span>
                        )} */}
                    </CommandItem>
                  );
                })}
              </CommandGroup>
              {selectedValues.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setSelectedValues([])}
                      className="justify-center text-center"
                    >
                      Сбросить фильтр
                    </CommandItem>
                  </CommandGroup>
                </>
              )}
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export { FacetFilter };
