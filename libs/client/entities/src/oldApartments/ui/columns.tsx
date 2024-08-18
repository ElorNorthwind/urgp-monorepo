import { createColumnHelper } from '@tanstack/react-table';
import { OldAppartment } from '@urgp/shared/entities';
import { AdressCell } from './cells/AdressCell';
import { ApartmentCell } from './cells/ApartmentCell';
import { FamilyCell } from './cells/FamilyCell';
import { StageCell } from './cells/StageCell';
import { DeviationCell } from './cells/DeviationCell';

const columnHelper = createColumnHelper<OldAppartment>();

export const oldApartmentColumns = [
  columnHelper.accessor('adress', {
    id: 'adress',
    header: 'Адрес',
    size: 200,
    enableSorting: false,
    cell: (props) => {
      return <AdressCell {...props} />;
    },
  }),

  columnHelper.accessor('apartmentNum', {
    id: 'apartNum',
    header: 'Кв.',
    size: 50,
    enableSorting: false,
    cell: (props) => {
      return <ApartmentCell {...props} />;
    },
  }),

  columnHelper.accessor('fio', {
    id: 'fio',
    header: 'ФИО',
    size: 120,
    enableSorting: false,
    cell: (props) => {
      return <FamilyCell {...props} />;
    },
  }),

  columnHelper.accessor('classificator.deviationMFR', {
    id: 'deviation',
    header: 'Отклонения',
    size: 150,
    enableSorting: false,
    cell: (props) => {
      return <DeviationCell {...props} />;
    },
  }),

  columnHelper.accessor('classificator.stage', {
    id: 'stage',
    header: 'Этап работы',
    size: 200,
    enableSorting: false,
    cell: (props) => {
      return <StageCell {...props} />;
    },
  }),
];
