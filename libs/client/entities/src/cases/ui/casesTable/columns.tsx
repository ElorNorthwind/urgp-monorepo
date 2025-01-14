import { createColumnHelper } from '@tanstack/react-table';
import { Case } from '@urgp/shared/entities';
import { DirectionCell } from './cells/DirectionCell';
import { Checkbox } from '@urgp/client/shared';
import { CaseTypeCell } from './cells/CaseTypeCell';
import { ExternalCasesCell } from './cells/ExternalCasesCell';
import { CaseStatusCell } from './cells/CaseStatusCell';
import { CaseDesctiptionCell } from './cells/CaseDescriptionCell';

const columnHelper = createColumnHelper<Case>();

export const controlCasesColumns = [
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
    cell: ({ row }) => {
      return (
        <div
          className="flex h-14 items-center justify-center"
          onClick={(e) => e.stopPropagation()}
        >
          <Checkbox
            className="size-5"
            checked={row.getIsSelected()}
            disabled={!row.getCanSelect()}
            onClick={row.getToggleSelectedHandler()}
          />
        </div>
      );
    },
  }),

  columnHelper.accessor(
    (row): string =>
      row?.payload?.externalCases?.map((d) => d.num)?.join(', ') || '',
    {
      id: 'externalCases',
      header: 'Обращение',
      size: 100,
      enableSorting: true,
      cell: (props) => {
        return <ExternalCasesCell {...props} />;
      },
    },
  ),

  columnHelper.accessor('payload.description', {
    id: 'description',
    header: 'Описание',
    size: 250,
    enableSorting: true,
    enableHiding: false,
    cell: (props) => {
      return <CaseDesctiptionCell {...props} />;
    },
  }),

  columnHelper.accessor((row): string => 'status.name', {
    id: 'status',
    header: 'Статус',
    size: 150,
    enableSorting: true,
    cell: (props) => {
      return <CaseStatusCell {...props} />;
    },
  }),

  columnHelper.accessor(
    (row) => row?.payload?.directions?.map((d) => d.name)?.join(', ') || '-',
    {
      id: 'directions',
      header: 'Направления',
      size: 190,
      enableSorting: true,
      cell: (props) => {
        return <DirectionCell {...props} />;
      },
    },
  ),

  columnHelper.accessor('payload.type.name', {
    id: 'type',
    header: 'Тип проблемы',
    size: 200,
    enableSorting: true,
    cell: (props) => {
      return <CaseTypeCell {...props} />;
    },
  }),
];
