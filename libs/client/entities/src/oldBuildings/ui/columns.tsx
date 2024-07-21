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
    header: 'Район',
    size: 140,
    cell: (props) => {
      return <AreaCell {...props} />;
    },
  }),

  columnHelper.accessor('adress', {
    header: 'Адрес',
    size: 250,
  }),

  columnHelper.accessor('relocationType', {
    header: 'Тип переселения',
    size: 200,
    cell: (props) => {
      return <RelocationTypeCell {...props} />;
    },
  }),

  columnHelper.accessor('buildingDeviation', {
    header: 'Статус',
    size: 180,
    cell: (props) => {
      return <RelocationStatusCell {...props} />;
    },
  }),

  columnHelper.accessor('terms.actual.firstResetlementStart', {
    header: 'Старт',
    size: 100,

    cell: (props) => {
      return <TermsCell {...props} />;
    },
  }),

  columnHelper.accessor((row) => row.totalApartments.toString(), {
    header: 'Квартир',
    size: 80,
    cell: (props) => {
      return <ApartmentsCell {...props} />;
    },
    // cell: (info) => {
    //   return info.row.original.totalApartments > 0 ? (
    //     <div className="min-w-[30px]">{info.getValue()}</div>
    //   ) : (
    //     <div className="text-muted-foreground  min-w-[30px] ">-</div>
    //   );
    // },
  }),
  columnHelper.accessor((row) => row.apartments.deviation.done.toString(), {
    header: 'Ход работы',
    size: 220,
    cell: (props) => {
      return <DeviationsCell {...props} />;
    },
  }),
];
