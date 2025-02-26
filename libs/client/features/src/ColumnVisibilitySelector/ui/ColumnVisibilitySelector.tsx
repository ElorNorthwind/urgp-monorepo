import { CheckIcon, Settings2 } from 'lucide-react';
import { useMemo, useState } from 'react';
import {
  Button,
  CaseRoutes,
  clearIncidentTableColumns,
  clearPendingTableColumns,
  clearProblemTableColumns,
  cn,
  Command,
  CommandEmpty,
  CommandInput,
  CommandItem,
  CommandList,
  Popover,
  PopoverContent,
  PopoverTrigger,
  selectIncidentTableColumns,
  selectPendingTableColumns,
  selectProblemTableColumns,
  Separator,
  setIncidentTableColumns,
  setPendingTableColumns,
  setProblemTableColumns,
} from '@urgp/client/shared';
import { useDispatch, useSelector } from 'react-redux';
import { useLocation } from '@tanstack/react-router';
import { VisibilityState } from '@tanstack/react-table';
import {
  defaultIncidentColumns,
  defaultPendingColumns,
  defaultProblemColumns,
} from '@urgp/client/entities';
import {
  ActionCreatorWithoutPayload,
  ActionCreatorWithPayload,
} from '@reduxjs/toolkit';

type PathnameOptions = {
  [key: string]: {
    defaultVisibility: VisibilityState;
    columnVisibility: VisibilityState;
    setDispatch: ActionCreatorWithPayload<VisibilityState>;
    clearDisparch: ActionCreatorWithoutPayload;
  };
};

interface ColumnVisibilitySelectorProps
  extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

function ColumnVisibilitySelector(
  props: ColumnVisibilitySelectorProps,
): JSX.Element | null {
  const { className } = props;
  const [open, setOpen] = useState(false);
  const [searchValue, setSearchValue] = useState('');
  const incidentColumnVisibility = useSelector(selectIncidentTableColumns);
  const pendingColumnVisibility = useSelector(selectPendingTableColumns);
  const problemColumnVisibility = useSelector(selectProblemTableColumns);
  const dispatch = useDispatch();

  const pathnameOptions: PathnameOptions = {
    '/control/cases': {
      defaultVisibility: defaultIncidentColumns,
      columnVisibility: incidentColumnVisibility,
      setDispatch: setIncidentTableColumns,
      clearDisparch: clearIncidentTableColumns,
    },
    '/control/pending': {
      defaultVisibility: defaultPendingColumns,
      columnVisibility: pendingColumnVisibility,
      setDispatch: setPendingTableColumns,
      clearDisparch: clearPendingTableColumns,
    },
    '/control/problems': {
      defaultVisibility: defaultProblemColumns,
      columnVisibility: problemColumnVisibility,
      setDispatch: setProblemTableColumns,
      clearDisparch: clearProblemTableColumns,
    },
  };

  const pathname = useLocation().pathname as CaseRoutes;
  if (!(pathname in pathnameOptions)) return null;

  const { defaultVisibility, columnVisibility, setDispatch, clearDisparch } =
    pathnameOptions?.[pathname];

  const columnNames = {
    smartApprove: 'Действия',
    externalCases: 'Обращения',
    desctiption: 'Описание',
    viewStatus: 'Статус отслеживания',
    status: 'Статус',
    directions: 'Направления',
    type: 'Тип проблемы',
    stage: 'Этап',
  };

  const isDefault = useMemo(() => {
    return (
      JSON.stringify(defaultVisibility) === JSON.stringify(columnVisibility)
    );
  }, [columnVisibility]);

  return (
    <Popover modal={true} open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          // disabled={isLoading}
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
            {Object.keys(columnVisibility || {}).map((column: string) => {
              const isSelected = columnVisibility?.[column];

              return (
                <CommandItem
                  key={column}
                  className="group/command-item relative"
                  onSelect={() => {
                    if (isSelected) {
                      dispatch(
                        setDispatch({
                          ...columnVisibility,
                          [column]: false,
                        }),
                      );
                    } else {
                      dispatch(
                        setDispatch({
                          ...columnVisibility,
                          [column]: true,
                        }),
                      );
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
                  <span>
                    {columnNames?.[column as keyof typeof columnNames] ||
                      column}
                  </span>
                </CommandItem>
              );
            })}
            <Separator className={cn(isDefault && 'hidden')} />
            <Button
              role="button"
              variant="ghost"
              className={cn('w-full', isDefault && 'hidden')}
              disabled={isDefault}
              onClick={() => dispatch(clearDisparch())}
            >
              Вернуть настройки по-умолчанию
            </Button>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
}

export { ColumnVisibilitySelector };
