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
  CommandSeparator,
  Popover,
  PopoverContent,
  PopoverTrigger,
  Separator,
} from '@urgp/client/shared';
import { CheckIcon, PlusCircleIcon } from 'lucide-react';
import { areasFlat } from './areas';

type Option = {
  value: string;
  group: string;
  label: string;
  //   icon?: React.ForwardRefExoticComponent<
  //     Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  //   >;
};
interface AreaFacetFilterProps extends React.HTMLAttributes<HTMLDivElement> {
  //   options: Option[];
  selectedValues: string[];
  setSelectedValues: (value: string[]) => void;
  title?: string;
}

function AreaFacetFilter(props: AreaFacetFilterProps): JSX.Element {
  const { selectedValues, className, title, setSelectedValues } = props;

  const options: Option[] = Object.keys(areasFlat).reduce((acc, curr) => {
    return [
      ...acc,
      ...areasFlat[curr as keyof typeof areasFlat].map(
        (item) =>
          ({
            value: item,
            group: curr,
            label: item,
          }) as Option,
      ),
    ];
  }, [] as Option[]);

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
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder={title} />
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
                      <span>{option.label}</span>
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

export { AreaFacetFilter };
