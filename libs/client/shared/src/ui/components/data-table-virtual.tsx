import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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
import { HStack } from './stack';
import { LoaderCircle } from 'lucide-react';
import { ScrollArea } from './scroll-area';
import { useCallback, useEffect, useRef, useState } from 'react';
import { cn } from '../../lib/cn';
import { useVirtualizer } from '@tanstack/react-virtual';

interface VirtualDataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data?: TData[];
  totalCount: number;
  isFetching: boolean;
  callbackMargin?: number;
  callbackFn?: () => void;
  className?: string;
}

export function VirtualDataTable<TData, TValue>({
  columns,
  data = [],
  isFetching = false,
  totalCount,
  callbackMargin = 1000,
  callbackFn,
  className,
}: VirtualDataTableProps<TData, TValue>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    defaultColumn: {
      size: 200, //starting column size
      // minSize: 50, //enforced during column resizing
      // maxSize: 500, //enforced during column resizing
    },
  });

  const { rows } = table.getRowModel();
  const rowVirtualizer = useVirtualizer({
    count: rows.length,
    estimateSize: () => 73, //estimate row height for accurate scrollbar dragging
    getScrollElement: () => tableContainerRef.current,
    // measure dynamic row height, except in firefox because it measures table border height incorrectly
    measureElement:
      typeof window !== 'undefined' &&
      navigator.userAgent.indexOf('Firefox') === -1
        ? (element) => element?.getBoundingClientRect().height
        : undefined,
    overscan: 5,
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
      className={cn('relative overflow-auto rounded-md border', className)}
      ref={tableContainerRef}
      onScroll={(e) => onCallbackOnBottomReached(e.target as HTMLDivElement)}
    >
      <Table className="gri">
        <TableHeader
          className={cn(
            'sticky top-0 z-10 grid',
            isScrolled && 'shadow backdrop-blur-md',
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow
              key={headerGroup.id}
              style={{ display: 'flex' }}
              className=""
            >
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead
                    key={header.id}
                    className={cn(
                      'items-center justify-center overflow-y-clip text-center align-middle',
                    )}
                    style={{
                      display: 'flex',
                      width: `${Math.floor((header.getSize() / table.getTotalSize()) * 100)}%`,
                      minWidth: `${header.getSize()}px`,
                    }}
                  >
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
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
          {table.getRowModel().rows?.length
            ? rowVirtualizer.getVirtualItems().map((virtualRow) => {
                const row = rows[virtualRow.index] as Row<TData>;
                return (
                  <TableRow
                    key={row.id}
                    className="overflow-y-clip"
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
                        key={cell.id}
                        className={cn(
                          'items-center justify-items-center overflow-y-clip',
                        )}
                        style={{
                          display: 'flex',
                          width: `${Math.floor((cell.column.getSize() / table.getTotalSize()) * 100)}%`,
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
            : !isFetching && (
                <TableRow className="flex hover:bg-white/0">
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 w-full text-center"
                  >
                    Нет данных
                  </TableCell>
                </TableRow>
              )}
          {isFetching && (
            <TableRow className="flex hover:bg-white/0">
              <TableCell
                colSpan={columns.length}
                className="h-24 w-full text-center"
              >
                <HStack className="h-full" align="center" justify="center">
                  <LoaderCircle className="stroke-muted-foreground h-10 w-10 animate-spin" />
                  <div className="text-2xl">Загрузка...</div>
                </HStack>
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </ScrollArea>
  );
}
