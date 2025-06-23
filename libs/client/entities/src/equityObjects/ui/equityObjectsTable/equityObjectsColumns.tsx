import { EquityObject } from '@urgp/shared/entities';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@urgp/client/shared';
import { EquityCheckboxCell } from './cells/EquityCheckboxCell';

const columnHelper = createColumnHelper<EquityObject>();

export const equityObjectsColumns = [
  columnHelper.display({
    id: 'select',
    size: 40,
    enableHiding: false,
    header: ({ table }) => (
      <Checkbox
        className="size-5"
        checked={
          table.getIsAllRowsSelected()
            ? true
            : table.getIsSomeRowsSelected()
              ? 'indeterminate'
              : false
        }
        onClick={table.getToggleAllRowsSelectedHandler()}
      />
    ),
    cell: (props) => {
      return <EquityCheckboxCell {...props} />;
    },
  }),

  columnHelper.accessor((row) => row?.building?.addressShort, {
    id: 'address',
    header: 'Адрес',
    size: 120,
    enableHiding: true,
    enableSorting: true,
    sortDescFirst: true,
  }),

  columnHelper.accessor((row): string => row?.creditor || '', {
    id: 'creditor',
    header: 'ФИО кредитора',
    size: 100,
    enableSorting: true,
    sortDescFirst: true,
  }),
];
