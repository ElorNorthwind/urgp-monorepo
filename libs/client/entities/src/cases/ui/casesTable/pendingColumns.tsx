import { createColumnHelper } from '@tanstack/react-table';
import { Checkbox } from '@urgp/client/shared';
import { CaseDesctiptionCell } from './cells/CaseDescriptionCell';
import { CaseStatusCell } from './cells/CaseStatusCell';
import { CaseTypeCell } from './cells/CaseTypeCell';
import { DirectionCell } from './cells/DirectionCell';
import { ExternalCasesCell } from './cells/ExternalCasesCell';
import { SmartApproveCell } from './cells/SmartApproveCell';
import { CheckboxCell } from './cells/CheckboxCell';
import { isBefore } from 'date-fns';
import { Eye } from 'lucide-react';
import { ViewStatusCell } from './cells/ViewStatusCell';
import { CaseFull } from '@urgp/shared/entities';
import { RelevantStageCell } from './cells/RelevantStageCell';

const columnHelper = createColumnHelper<CaseFull>();

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
  columnHelper.accessor((row) => row?.actions.join(', '), {
    id: 'smartApprove',
    header: 'Действия',
    size: 120,
    enableHiding: true,
    enableSorting: true,
    cell: (props) => {
      return <SmartApproveCell {...props} />;
    },
  }),

  columnHelper.accessor(
    (row): string => row?.externalCases?.map((d) => d.num)?.join(', ') || '',
    {
      id: 'externalCases',
      header: 'Обращение',
      size: 100,
      enableSorting: true,
      cell: (props) => {
        return <ExternalCasesCell {...props} />;
      },
      sortingFn: (rowA, rowB) => {
        const dif = (rowA.original.externalCases?.[0]?.num || '').localeCompare(
          rowB.original.externalCases?.[0]?.num || '',
        );
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
  columnHelper.accessor('notes', {
    id: 'description',
    header: 'Описание',
    size: 250,
    enableSorting: true,
    enableHiding: false,
    cell: (props) => {
      return <CaseDesctiptionCell {...props} />;
    },
    sortingFn: (rowA, rowB) => {
      const dif = (rowA.original?.title || '').localeCompare(
        rowB.original?.title || '',
      );
      return dif > 0 ? 1 : dif < 0 ? -1 : 0;
    },
  }),

  columnHelper.accessor('status.name', {
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
    (row) => row?.directions?.map((d) => d?.name)?.join(', ') || '-',
    {
      id: 'directions',
      header: 'Направления',
      size: 140,
      enableSorting: true,
      cell: (props) => {
        return <DirectionCell {...props} />;
      },
      sortingFn: (rowA, rowB) => {
        const dif = (rowA.original.directions?.[0]?.name || '').localeCompare(
          rowB.original.directions?.[0]?.name || '',
        );
        return dif > 0 ? 1 : dif < 0 ? -1 : 0;
      },
    },
  ),

  columnHelper.accessor('type.name', {
    id: 'type',
    header: 'Тип проблемы',
    size: 150,
    enableSorting: true,
    cell: (props) => {
      return <CaseTypeCell {...props} />;
    },
    sortingFn: (rowA, rowB) => {
      const dif1 =
        (rowA.original?.type?.priority || 0) -
        (rowB.original?.type?.priority || 0);
      const dif2 = (rowA.original?.type?.name || '').localeCompare(
        rowB.original?.type?.name || '',
      );
      return dif1 > 0 ? 1 : dif1 < 0 ? -1 : dif2 > 0 ? 1 : dif2 < 0 ? -1 : 0;
    },
  }),

  columnHelper.accessor(
    (row) => row?.myPendingStage?.doneDate || row?.lastStage?.doneDate || '',
    {
      id: 'stage',
      header: 'Этап',
      size: 200,
      enableSorting: true,
      cell: (props) => {
        return <RelevantStageCell {...props} />;
      },

      // sortingFn: (rowA, rowB) => {
      //   const dif1 = (rowA.original?.actions?.[0] || '').localeCompare(
      //     rowB.original?.actions?.[0] || '',
      //   );
      //   // const dif2 =
      //   //   (rowA.original.payload?.type?.priority || 0) -
      //   //   (rowB.original.payload?.type?.priority || 0);
      //   return dif1 > 0
      //     ? 1
      //     : dif1 < 0
      //       ? -1
      //       : isBefore(
      //             rowA.original?.myPendingStage?.doneDate || 0,
      //             rowB.original?.myPendingStage?.doneDate || 0,
      //           )
      //         ? 1
      //         : -1;
      // },
    },
  ),
];
