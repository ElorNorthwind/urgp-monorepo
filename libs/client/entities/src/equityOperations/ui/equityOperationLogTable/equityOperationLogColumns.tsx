import { EquityObject, EquityOperationLogItem } from '@urgp/shared/entities';
import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@urgp/client/shared';
import { EquityCheckboxCell } from './cells/EquityCheckboxCell';
import { EquityBuildingCell } from './cells/EquityBuildingCell';
import { EquityObjectNumberCell } from './cells/EquityObjectNumberCell';
import { EquityObjectStatusCell } from './cells/EquityObjectStatusCell';
import { EquityCreditorCell } from './cells/EquityCreditorCell';
import { EquityOperationTypeCell } from './cells/EquityOperationTypeCell';

const columnHelper = createColumnHelper<EquityOperationLogItem>();

export const equityOperationLogColumns = [
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

  columnHelper.accessor(
    (row) => {
      return row?.statusId || 0;
    },
    {
      id: 'opType',
      header: 'Тип операции',
      size: 180,
      enableHiding: true,
      enableSorting: true,
      sortDescFirst: true,
      cell: (props) => {
        return <EquityOperationTypeCell {...props} />;
      },
    },
  ),

  columnHelper.accessor(
    (row) => {
      return row?.addressShort || '';
    },
    {
      id: 'address',
      header: 'Адрес',
      size: 120,
      enableHiding: true,
      enableSorting: true,
      sortDescFirst: true,
      cell: (props) => {
        return <EquityBuildingCell {...props} />;
      },
    },
  ),

  columnHelper.accessor(
    (row) => {
      return row?.npp || 0;
    },
    {
      id: 'number',
      header: 'Помещение',
      size: 160,
      enableHiding: true,
      enableSorting: true,
      sortDescFirst: true,
      cell: (props) => {
        return <EquityObjectNumberCell {...props} />;
      },
    },
  ),

  columnHelper.accessor((row): string => row?.creditor || '', {
    id: 'creditor',
    header: 'ФИО кредитора',
    size: 120,
    enableSorting: true,
    sortDescFirst: true,
    cell: (props) => {
      return <EquityCreditorCell {...props} />;
    },
  }),
];
