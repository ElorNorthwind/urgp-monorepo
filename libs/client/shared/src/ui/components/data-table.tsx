import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
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

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  totalCount: number;
  isFetching: boolean;
  callbackMargin?: number;
  callbackFn?: () => void;
  className?: string;
}

export function VirtualDataTable<TData, TValue>({
  columns,
  data,
  isFetching = false,
  totalCount,
  callbackMargin = 1000,
  callbackFn,
  className,
}: DataTableProps<TData, TValue>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
      className={cn('relative overflow-auto rounded-md border ', className)}
      ref={tableContainerRef}
      onScroll={(e) => onCallbackOnBottomReached(e.target as HTMLDivElement)}
    >
      <Table className="">
        <TableHeader
          className={cn(
            'sticky top-0 z-10',
            isScrolled && 'shadow backdrop-blur-md',
          )}
        >
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
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
        <TableBody className="relative">
          {table.getRowModel().rows?.length
            ? table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && 'selected'}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            : !isFetching && (
                <TableRow>
                  <TableCell
                    colSpan={columns.length}
                    className="h-24 text-center"
                  >
                    Нет данных
                  </TableCell>
                </TableRow>
              )}
          {isFetching && (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
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
