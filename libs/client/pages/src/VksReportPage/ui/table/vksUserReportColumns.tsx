import { createColumnHelper } from '@tanstack/react-table';
import { VksCase, VksUserStats } from '@urgp/shared/entities';
import { VksUserGradeCell } from './cells/VksUserGradeCell';
import { VksUserConversionCell } from './cells/VksUserConversionCell';
import { VksUserWorkloadCell } from './cells/VksUserWorkloadCell';
import { VksUserLinkCell } from './cells/VksUserLinkCell';

const columnHelper = createColumnHelper<VksUserStats>();

export const vksUserReportColumns = [
  // columnHelper.display({
  //   id: 'link',
  //   header: '',
  //   size: 5,
  //   enableHiding: false,
  //   enableSorting: false,
  //   sortDescFirst: false,
  //   cell: (props) => {
  //     return <VksUserLinkCell {...props} />;
  //   },
  // }),

  columnHelper.accessor((row) => row?.operator, {
    id: 'operator',
    header: 'Оператор',
    size: 50,
    enableHiding: false,
    enableSorting: true,
    sortDescFirst: true,
    cell: (props) => {
      return <VksUserLinkCell {...props} />;
    },
  }),

  columnHelper.accessor((row) => row?.load ?? 0.0, {
    id: 'workload',
    header: 'Нагрузка',
    size: 30,
    enableHiding: false,
    enableSorting: true,
    sortDescFirst: true,
    cell: (props) => {
      return <VksUserWorkloadCell {...props} />;
    },
  }),

  columnHelper.accessor((row) => row?.graded ?? 0, {
    id: 'graded',
    header: 'Конв.',
    size: 40,
    enableHiding: false,
    enableSorting: true,
    sortDescFirst: true,
    meta: {
      headerClass: 'justify-center',
    },
    cell: (props) => {
      return <VksUserConversionCell {...props} />;
    },
  }),

  columnHelper.accessor((row) => row?.grade, {
    id: 'grade',
    header: 'Оценка',
    size: 50,
    enableHiding: false,
    enableSorting: true,
    sortDescFirst: true,
    cell: (props) => {
      return <VksUserGradeCell {...props} />;
    },
  }),
];
