import { createColumnHelper } from '@tanstack/react-table';
import { OldBuilding } from '@urgp/shared/entities';
import { AreaCell } from './cells/AreaCell';
import { RelocationTypeCell } from './cells/RelocationTypeCell';
import { RelocationStatusCell } from './cells/RelocationStatusCell';
import { TermsCell } from './cells/TermsCell';
import { DeviationsCell } from './cells/DeviationsCell';
import { ApartmentsCell } from './cells/ApartmentsCell';

const columnHelper = createColumnHelper<OldBuilding>();

export const oldBuildingsColumns = [
  columnHelper.accessor('district', {
    id: 'district',
    header: 'Район',
    size: 150,
    cell: (props) => {
      return <AreaCell {...props} />;
    },
  }),

  columnHelper.accessor('adress', {
    id: 'adress',
    header: 'Адрес',
    size: 240,
    // cell: (props) => {
    //   return <AdressCell {...props} />;
    // },
  }),

  columnHelper.accessor('buildingRelocationStartAge', {
    id: 'age',
    header: 'Тип и срок',
    size: 215,
    cell: (props) => {
      return <RelocationTypeCell {...props} />;
    },
  }),

  columnHelper.accessor('buildingRelocationStatus', {
    id: 'status',
    header: 'Статус',
    size: 180,
    cell: (props) => {
      return <RelocationStatusCell {...props} />;
    },
    // enableSorting: false,
  }),

  columnHelper.accessor(
    (row) => (row.terms.actual.firstResetlementStart || '-').toString(),
    {
      // terms.actual.firstResetlementStart'
      id: 'date',
      header: 'Старт',
      size: 90,

      cell: (props) => {
        return <TermsCell {...props} />;
      },
      meta: {
        headerClass: 'justify-center',
        cellClass: 'justify-center text-center',
      },
    },
  ),

  columnHelper.accessor((row) => row.totalApartments.toString(), {
    id: 'total',
    header: 'Квартир',
    sortDescFirst: true,
    size: 80,
    cell: (props) => {
      return <ApartmentsCell {...props} />;
    },
    meta: {
      headerClass: 'justify-center',
      cellClass: 'justify-center text-center',
    },
    enableSorting: true,
  }),

  columnHelper.accessor((row) => row.apartments.deviation.done.toString(), {
    id: 'risk',
    header: 'Ход работы',
    size: 220,
    sortDescFirst: true,
    cell: (props) => {
      return <DeviationsCell {...props} />;
    },
    meta: {
      headerClass: 'justify-center',
    },
  }),
];
