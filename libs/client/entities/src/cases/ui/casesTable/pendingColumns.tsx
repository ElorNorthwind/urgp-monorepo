import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@urgp/client/shared';
import { CaseWithPendingInfo } from '@urgp/shared/entities';
import { CaseDesctiptionCell } from './cells/CaseDescriptionCell';
import { CaseStatusCell } from './cells/CaseStatusCell';
import { CaseTypeCell } from './cells/CaseTypeCell';
import { DirectionCell } from './cells/DirectionCell';
import { ExternalCasesCell } from './cells/ExternalCasesCell';
import { PendingOperationCell } from './cells/PendingOperationCell';
import { SmartApproveCell } from './cells/SmartApproveCell';
import { CheckboxCell } from './cells/CheckboxCell';
import { isBefore } from 'date-fns';
import { Eye } from 'lucide-react';
import { ViewStatusCell } from './cells/ViewStatusCell';

const columnHelper = createColumnHelper<CaseWithPendingInfo>();

export const pendingCasesColumns = [
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
      return <CheckboxCell {...props} />;
    },
  }),
  columnHelper.accessor('action', {
    id: 'smartApprove',
    header: 'Действие',
    size: 90,
    enableHiding: true,
    enableSorting: true,
    cell: (props) => {
      return <SmartApproveCell {...props} />;
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
      sortingFn: (rowA, rowB) => {
        const dif = (
          rowA.original.payload?.externalCases?.[0]?.num || ''
        ).localeCompare(rowB.original.payload?.externalCases?.[0]?.num || '');
        return dif > 0 ? 1 : dif < 0 ? -1 : 0;
      },
    },
  ),

  columnHelper.accessor('viewStatus', {
    id: 'viewStatus',
    header: () => {
      return <Eye />;
    },
    size: 40,
    enableSorting: true,
    enableHiding: true,
    cell: (props) => {
      return <ViewStatusCell {...(props as any)} />;
    },
  }),
  columnHelper.accessor('payload.description', {
    id: 'description',
    header: 'Описание',
    size: 250,
    enableSorting: true,
    enableHiding: false,
    cell: (props) => {
      return <CaseDesctiptionCell {...props} />;
    },
    sortingFn: (rowA, rowB) => {
      const dif = (rowA.original?.payload?.fio || '').localeCompare(
        rowB.original.payload?.fio || '',
      );
      return dif > 0 ? 1 : dif < 0 ? -1 : 0;
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
    sortingFn: (rowA, rowB) => {
      const dif1 =
        (rowA.original?.status?.priority || 0) -
        (rowB.original?.status?.priority || 0);
      const dif2 = (rowA.original?.status?.name || '').localeCompare(
        rowB.original?.status?.name || '',
      );
      return dif1 > 0 ? 1 : dif1 < 0 ? -1 : dif2 > 0 ? 1 : dif2 < 0 ? -1 : 0;
    },
  }),

  columnHelper.accessor(
    (row) => row?.payload?.directions?.map((d) => d?.name)?.join(', ') || '-',
    {
      id: 'directions',
      header: 'Направления',
      size: 140,
      enableSorting: true,
      cell: (props) => {
        return <DirectionCell {...props} />;
      },
      sortingFn: (rowA, rowB) => {
        const dif = (
          rowA.original.payload?.directions?.[0]?.name || ''
        ).localeCompare(rowB.original.payload?.directions?.[0]?.name || '');
        return dif > 0 ? 1 : dif < 0 ? -1 : 0;
      },
    },
  ),

  columnHelper.accessor('payload.type.name', {
    id: 'type',
    header: 'Тип проблемы',
    size: 150,
    enableSorting: true,
    cell: (props) => {
      return <CaseTypeCell {...props} />;
    },
    sortingFn: (rowA, rowB) => {
      const dif1 =
        (rowA.original.payload?.type?.priority || 0) -
        (rowB.original.payload?.type?.priority || 0);
      const dif2 = (rowA.original.payload?.type?.name || '').localeCompare(
        rowB.original.payload?.type?.name || '',
      );
      return dif1 > 0 ? 1 : dif1 < 0 ? -1 : dif2 > 0 ? 1 : dif2 < 0 ? -1 : 0;
    },
  }),

  columnHelper.accessor('pendingStage.payload.doneDate', {
    id: 'pendingStage',
    header: 'Этап',
    size: 200,
    enableSorting: true,
    cell: (props) => {
      return <PendingOperationCell {...props} />;
    },

    sortingFn: (rowA, rowB) => {
      const dif1 = (rowA.original?.action || '').localeCompare(
        rowB.original?.action || '',
      );
      // const dif2 =
      //   (rowA.original.payload?.type?.priority || 0) -
      //   (rowB.original.payload?.type?.priority || 0);
      return dif1 > 0
        ? 1
        : dif1 < 0
          ? -1
          : isBefore(
                rowA.original?.pendingStage?.payload?.doneDate || 0,
                rowB.original?.pendingStage?.payload?.doneDate || 0,
              )
            ? 1
            : -1;
    },
  }),
];
