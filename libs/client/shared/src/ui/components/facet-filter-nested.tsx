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
import { useMemo } from 'react';

type Option<TValue extends string | number> = {
  value: TValue;
  label: string;
  icon?: React.ForwardRefExoticComponent<
    Omit<LucideProps, 'ref'> & React.RefAttributes<SVGSVGElement>
  >;
  className?: string;
  items: (Omit<Option<TValue>, 'items'> & { keyword?: string })[];
};
interface NestedFacetFilterProps<TValue extends string | number>
  extends React.HTMLAttributes<HTMLDivElement> {
  groups: Option<TValue>[];
  selectedValues?: TValue[];
  setSelectedValues: (value: TValue[]) => void;
  title?: string;
  selectAllToggle?: boolean;
  triggerClassName?: string;
}

// function SelectAllToggle<TValue extends string | number>({
//   selected,
//   setSelectedValues,
// }: {
//   selected: TValue[];
//   setSelectedValues: (value: TValue[]) => void;
// }): JSX.Element {
//   const state = useCommandState((state) => state);
//   return (
//     <CommandGroup forceMount>
//       <CommandItem
//         forceMount
//         // value="doNotFilter-selectAllToggle"
//         onSelect={() => setSelectedValues([])}
//         className={cn('justify-center text-center')}
//       >
//         {selected.length} / {state.filtered.items.values()}
//         {JSON.stringify(state.filtered.items)}
//       </CommandItem>
//     </CommandGroup>
//   );
// }

function NestedFacetFilter<TValue extends string | number>(
  props: NestedFacetFilterProps<TValue>,
): JSX.Element {
  const {
    groups,
    selectedValues = [],
    className,
    title,
    setSelectedValues,
    selectAllToggle = false,
    triggerClassName,
  } = props;

  const taggedGroups = useMemo(() => {
    return groups.map((group) => ({
      ...group,
      items: group.items.map((item) => ({ ...item, keyword: group.label })),
    }));
  }, [groups]);

  const flattenItems = useMemo(() => {
    return groups.reduce((accumulator, current) => {
      return [...accumulator, ...current.items];
    }, []);
  }, [groups]);

  return (
    <div className={cn('flex items-center space-x-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn('h-8 border-dashed', triggerClassName)}
          >
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
                    flattenItems
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
        <PopoverContent className="p-0" align="start">
          <Command
            filter={(value, search, keywords) => {
              const extendValue = (
                value +
                ' ' +
                keywords.join(' ')
              ).toLowerCase();
              if (extendValue.includes(search.toLowerCase())) return 1;
              return 0;
            }}
          >
            <CommandInput placeholder={title} />
            <CommandList>
              {/* {selectAllToggle && (
                <SelectAllToggle
                  selected={selectedValues}
                  setSelectedValues={setSelectedValues}
                />
              )} */}
              <CommandEmpty>Не найдено.</CommandEmpty>
              {taggedGroups.map((group) => {
                return (
                  <CommandGroup key={group.value} heading={group.label}>
                    {group.items.map((option) => {
                      const isSelected = selectedValues.includes(option.value);
                      return (
                        <CommandItem
                          key={option.value}
                          keywords={[option.keyword || '']}
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
                        </CommandItem>
                      );
                    })}
                  </CommandGroup>
                );
              })}
              {selectedValues.length > 0 && (
                <>
                  <CommandSeparator />
                  <CommandGroup>
                    <CommandItem
                      onSelect={() => setSelectedValues([])}
                      className={cn('justify-center text-center')}
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

export { NestedFacetFilter };
