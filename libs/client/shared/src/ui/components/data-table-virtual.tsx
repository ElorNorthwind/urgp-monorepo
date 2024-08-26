import {
  ColumnDef,
  ColumnSort,
  flexRender,
  getCoreRowModel,
  InitialTableState,
  Row,
  useReactTable,
} from '@tanstack/react-table';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from './table';
import { ChevronsUpDown, ChevronUp } from 'lucide-react';
import { ScrollArea } from './scroll-area';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { useVirtualizer } from '@tanstack/react-virtual';
import { Button } from './button';
import { Skeleton } from './skeleton';

interface VirtualDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  totalCount: number;
  isFetching: boolean;
  callbackMargin?: number;
  callbackFn?: () => void;
  className?: string;
  onRowClick?: (row: Row<TData>) => void;
  onRowDoubleClick?: (row: Row<TData>) => void;
  compact?: boolean;
  enableMultiRowSelection?: boolean;
  sorting?: ColumnSort[];
  setSorting?: (sorting: ColumnSort[]) => void;
  initialState?: InitialTableState;
  initialOffset?: number;
}

export function VirtualDataTable<TData, TValue>({
  columns,
  data = [],
  isFetching = false,
  totalCount,
  callbackMargin = 1000,
  callbackFn,
  className,
  onRowClick,
  onRowDoubleClick,
  compact = false,
  enableMultiRowSelection = true,
  sorting,
  setSorting,
  initialState,
  initialOffset = 0,
}: VirtualDataTableProps<TData, TValue>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 200, //starting column size
    },
    enableMultiRowSelection,
    manualSorting: true, //use pre-sorted row model instead of sorted row model
    state: {
      sorting,
    },
    onSortingChange: (updaterOrValue) => {
      if (typeof updaterOrValue === 'function') {
        setSorting(updaterOrValue(table.getState().sorting));
      } else {
        setSorting(updaterOrValue);
      }
    },
    initialState,
  });

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: isFetching ? rows.length + 10 : rows.length, // make some skeleton rows on fetching
    estimateSize: () => (compact ? 73 : 57), //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
    initialOffset: initialOffset,
  });

  const [isScrolled, setIsScrolled] = useState(false);

  const onCallbackOnBottomReached = useCallback(
    (containerRefElement?: HTMLDivElement | null) => {
      if (containerRefElement) {
        const { scrollHeight, scrollTop, clientHeight } = containerRefElement;
        setIsScrolled(scrollTop > 0);
        if (
          scrollHeight - scrollTop - clientHeight < callbackMargin &&
          !isFetching &&
          data.length < (totalCount ?? 0)
        ) {
          if (callbackFn) {
            callbackFn();
          }
        }
      }
    },
    [data.length, isFetching, totalCount, callbackFn, callbackMargin],
  );

  //a check on mount and after a fetch to see if the table is already scrolled to the bottom and immediately needs to fetch more data
  useEffect(() => {
    onCallbackOnBottomReached(tableContainerRef.current);
  }, [onCallbackOnBottomReached]);

  return (
    <ScrollArea
      className={cn(
        'relative overflow-auto rounded-md border',
        className,
        isScrolled && 'supports-[-moz-appearance:none]:rounded-none',
      )}
      ref={tableContainerRef}
      onScroll={(e) => onCallbackOnBottomReached(e.target as HTMLDivElement)}
    >
      <Table className="grid">
        <TableHeader
          className={cn(
            'supports-[-moz-appearance:none]:bg-primary-foreground/20 sticky top-0 z-10 grid',
            isScrolled && 'shadow backdrop-blur-md',
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id} style={{ display: 'flex' }}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    compact={compact}
                    key={header.id}
                    className={cn(
                      'text-muted-foreground items-center text-center align-middle',
                      header?.column?.columnDef?.meta?.headerClass,
                    )}
                    // onClick={() => header.column.toggleSorting()}
                    style={{
                      display: 'flex',
                      width: `${Math.round((header.getSize() / table.getTotalSize()) * 100)}%`,
                      minWidth: `${header.getSize()}px`,
                    }}
                  >
                    {header.column.getCanSort() ? (
                      <Button
                        variant="link"
                        className={cn(
                          'hover:text-primary group flex max-w-fit p-0 text-inherit hover:no-underline',
                        )}
                        onClick={() => header.column.toggleSorting()}
                      >
                        {header.isPlaceholder
                          ? null
                          : flexRender(
                              header.column.columnDef.header,
                              header.getContext(),
                            )}
                        <ChevronsUpDown
                          className={cn(
                            'text-muted-foreground/40 group-hover:text-muted-foreground ml-1 h-4 w-4 transition-transform',
                            header.column.getIsSorted()
                              ? 'scale-0'
                              : 'scale-100',
                          )}
                        />
                        <ChevronUp
                          className={cn(
                            'text-primary/60 group-hover:text-primary mr-[-1.5rem] h-6 w-6 -translate-x-[80%] transition-transform',
                            header.column.getIsSorted() === 'asc'
                              ? 'rotate-180 scale-100'
                              : header.column.getIsSorted() === 'desc'
                                ? 'scale-100'
                                : 'text-muted-foreground/40 scale-0',
                          )}
                        />
                      </Button>
                    ) : header.isPlaceholder ? null : (
                      flexRender(
                        header.column.columnDef.header,
                        header.getContext(),
                      )
                    )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody
          style={{
            display: 'grid',
            height: `${rowVirtualizer.getTotalSize()}px`, //tells scrollbar how big the table is
            position: 'relative', //needed for absolute positioning of rows
          }}
        >
          {table.getRowModel().rows?.length || isFetching ? (
            rowVirtualizer.getVirtualItems().map((virtualRow) => {
              if (virtualRow.index >= data.length) {
                return (
                  <TableRow
                    key={'skeleton_' + virtualRow.index}
                    className={cn('overflow-y-clip')}
                    data-index={virtualRow.index} //needed for dynamic row height measurement
                    ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                    style={{
                      display: 'flex',
                      position: 'absolute',
                      transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                      width: '100%',
                    }}
                  >
                    {table.getVisibleFlatColumns().map((column, index) => (
                      <TableCell
                        compact={compact}
                        key={'skeleton_col_' + index}
                        className={cn(
                          'items-center justify-items-center overflow-y-clip',
                        )}
                        style={{
                          display: 'flex',
                          width: `${Math.round((column.getSize() / table.getTotalSize()) * 100)}%`,
                          minWidth: `${column.getSize()}px`,
                        }}
                      >
                        <Skeleton className="h-10 w-full" />
                      </TableCell>
                    ))}
                  </TableRow>
                );
              }

              const row = rows[virtualRow.index] as Row<TData>;
              return (
                <TableRow
                  key={row.id}
                  className={cn(
                    'overflow-y-clip',
                    onRowClick && 'cursor-pointer',
                  )}
                  onClick={() => onRowClick(row)}
                  onDoubleClick={
                    onRowDoubleClick ? () => onRowDoubleClick(row) : undefined
                  }
                  data-state={row.getIsSelected() && 'selected'}
                  data-index={virtualRow.index} //needed for dynamic row height measurement
                  ref={(node) => rowVirtualizer.measureElement(node)} //measure dynamic row height
                  style={{
                    display: 'flex',
                    position: 'absolute',
                    transform: `translateY(${virtualRow.start}px)`, //this should always be a `style` as it changes on scroll
                    width: '100%',
                  }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell
                      compact={compact}
                      key={cell.id}
                      className={cn(
                        'items-center justify-items-center overflow-y-clip',
                        cell?.column?.columnDef?.meta?.cellClass,
                      )}
                      style={{
                        display: 'flex',
                        width: `${Math.round((cell.column.getSize() / table.getTotalSize()) * 100)}%`,
                        minWidth: `${cell.column.getSize()}px`,
                      }}
                    >
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow className="flex hover:bg-white/0">
              <TableCell
                colSpan={columns.length}
                className="h-24 w-full text-center"
              >
                Нет данных
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
