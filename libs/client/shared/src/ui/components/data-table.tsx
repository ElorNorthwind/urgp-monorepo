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
import { HStack, VStack } from './stack';
import { LoaderCircle } from 'lucide-react';

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isFetching?: boolean;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  isFetching = false,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    // <div className="relative w-full overflow-clip rounded-md border">
    <Table className="">
      <TableHeader className="sticky top-0 z-10 bg-clip-padding text-center backdrop-blur-md backdrop-brightness-95">
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
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
    // </div>
  );
}
