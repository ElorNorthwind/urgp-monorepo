import { createColumnHelper } from '@tanstack/react-table';
import { HStack, Progress, VStack } from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { AreaCell } from './cells/AreaCell';
import { RelocationTypeCell } from './cells/RelocationTypeCell';
import { RelocationStatusCell } from './cells/RelocationStatusCell';
import { TermsCell } from './cells/TermsCell';
import { ApartmentCell } from './cells/AppartmentsCell';

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
    size: 100,
    cell: (info) => {
      return info.row.original.totalApartments > 0 ? (
        <div className="min-w-[30px]">{info.getValue()}</div>
      ) : (
        <div className="text-muted-foreground  min-w-[30px] ">-</div>
      );
    },
  }),
  columnHelper.accessor((row) => row.apartments.status.contract.toString(), {
    header: 'Прогресс',
    size: 220,
    cell: (props) => {
      return <ApartmentCell {...props} />;
    },
    // cell: (props) => {
    //   const donePercent = Math.round(
    //     (props.row.original.appartments.status.contract /
    //       (props.row.original.appartments.total -
    //         props.row.original.appartments.status.empty)) *
    //       100,
    //   );
    //   return (
    //     <HStack
    //       gap="s"
    //       align={'start'}
    //       justify={'start'}
    //       className="w-[200px] flex-nowrap"
    //     >
    //       <div className="w-[30px] text-right">
    //         {donePercent > 0 ? donePercent + '%' : '-'}
    //       </div>
    //       <div className="w-[150px] ">
    //         <Progress value={donePercent} className="h-4 border" />
    //       </div>
    //     </HStack>
    //   );
    // },
  }),
];
