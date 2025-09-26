import { createColumnHelper, FilterFn, Row } from '@tanstack/react-table';
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
    sortingFn: (rowA, rowB) => {
      return rowA.original.okrugOrder > rowB.original.okrugOrder
        ? 1
        : rowA.original.okrugOrder < rowB.original.okrugOrder
          ? -1
          : rowA.original.district.localeCompare(rowB.original.district) > 0
            ? 1
            : rowA.original.district.localeCompare(rowB.original.district) < 0
              ? -1
              : 0;
    },
  }),

  columnHelper.accessor('adress', {
    id: 'adress',
    header: 'Адрес',
    size: 240,
    sortingFn: 'alphanumeric',
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
    // sortingFn: (rowA, rowB) => {
    //   return (rowA.original.terms.actual.firstResetlementStart ??
    //     rowA.original.terms.plan.firstResetlementStart ??
    //     0) >
    //     (rowB.original.terms.actual.firstResetlementStart ??
    //       rowB.original.terms.plan.firstResetlementStart ??
    //       0)
    //     ? 1
    //     : (rowA.original.terms.actual.firstResetlementStart ??
    //           rowA.original.terms.plan.firstResetlementStart ??
    //           0) <
    //         (rowB.original.terms.actual.firstResetlementStart ??
    //           rowB.original.terms.plan.firstResetlementStart ??
    //           0)
    //       ? -1
    //       : 0;
    // },
    sortingFn: 'alphanumeric',
  }),

  columnHelper.accessor('buildingRelocationStatus', {
    id: 'status',
    header: 'Статус',
    size: 180,
    cell: (props) => {
      return <RelocationStatusCell {...props} />;
    },
    // enableSorting: false,
    sortingFn: (rowA, rowB) => {
      return rowA.original.statusOrder > rowB.original.statusOrder
        ? 1
        : rowA.original.statusOrder < rowB.original.statusOrder
          ? -1
          : rowA.original.okrugOrder > rowB.original.okrugOrder
            ? 1
            : rowA.original.okrugOrder < rowB.original.okrugOrder
              ? -1
              : rowA.original.district.localeCompare(rowB.original.district);
    },
  }),

  columnHelper.accessor(
    (row) => (row?.terms?.actual?.firstResetlementStart || '-').toString(),
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
      sortingFn: (rowA, rowB) => {
        return (rowA?.original?.terms?.actual?.firstResetlementStart ??
          rowA?.original?.terms?.plan?.firstResetlementStart ??
          0) >
          (rowB?.original?.terms?.actual?.firstResetlementStart ??
            rowB?.original?.terms?.plan?.firstResetlementStart ??
            0)
          ? 1
          : (rowA?.original?.terms?.actual?.firstResetlementStart ??
                rowA?.original?.terms?.plan?.firstResetlementStart ??
                0) <
              (rowB?.original?.terms?.actual?.firstResetlementStart ??
                rowB?.original?.terms?.plan?.firstResetlementStart ??
                0)
            ? -1
            : 0;
      },
    },
  ),

  columnHelper.accessor(
    (row) => (row.apartments.total === 0 ? undefined : row.apartments.total),
    {
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
      sortUndefined: 'last',
    },
  ),

  columnHelper.accessor(
    (row) =>
      row.apartments.total === 0
        ? undefined
        : row.apartments.deviation.risk / row.apartments.total,
    {
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
      sortUndefined: 'last',
      sortingFn: (rowA, rowB) => {
        return rowA.original.apartments.deviation.risk /
          rowA.original.apartments.total >
          rowB.original.apartments.deviation.risk /
            rowB.original.apartments.total
          ? 1
          : rowA.original.apartments.deviation.risk /
                rowA.original.apartments.total <
              rowB.original.apartments.deviation.risk /
                rowB.original.apartments.total
            ? -1
            : rowA.original.apartments.deviation.attention /
                  rowA.original.apartments.total >
                rowB.original.apartments.deviation.done /
                  rowB.original.apartments.total
              ? 1
              : rowA.original.apartments.deviation.attention /
                    rowA.original.apartments.total <
                  rowB.original.apartments.deviation.done /
                    rowB.original.apartments.total
                ? -1
                : 0;
      },
    },
  ),
];
