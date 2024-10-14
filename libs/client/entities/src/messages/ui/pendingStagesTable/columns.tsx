import { createColumnHelper } from '@tanstack/react-table';
import { PendingStage } from '@urgp/shared/entities';
import { AdressCell } from './cells/AdressCell';
import { ApartmentCell } from './cells/ApartmentCell';
import { PendingStageCell } from './cells/PendingStageCell';
import { ApproveCell } from './cells/ApproveCell';

const columnHelper = createColumnHelper<PendingStage>();

export const pendingStagesColumns = [
  columnHelper.accessor('adress', {
    id: 'adress',
    header: 'Адрес',
    size: 150,
    enableSorting: false,
    cell: (props) => {
      return <AdressCell {...props} />;
    },
  }),

  columnHelper.accessor('apartNum', {
    id: 'apartNum',
    header: 'Текущий статус',
    size: 200,
    enableSorting: false,
    cell: (props) => {
      return <ApartmentCell {...props} />;
    },
  }),

  columnHelper.accessor('pendingStageName', {
    id: 'pendingStageName',
    header: 'Предлагаемый этап',
    size: 300,
    enableSorting: false,
    cell: (props) => {
      return <PendingStageCell {...props} />;
    },
  }),

  columnHelper.display({
    id: 'actions',
    size: 70,
    header: 'Согласование',
    cell: (props) => {
      return <ApproveCell {...props} />;
    },
  }),
];
