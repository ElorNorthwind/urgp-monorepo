import { createColumnHelper } from '@tanstack/react-table';
import { OldAppartment } from '@urgp/shared/entities';

const columnHelper = createColumnHelper<OldAppartment>();

export const oldApartmentColumns = [
  columnHelper.accessor('adress', {
    id: 'adress',
    header: 'Адрес',
    size: 150,
    enableSorting: false,
  }),

  columnHelper.accessor('apartmentNum', {
    id: 'apartNum',
    header: 'Квартира',
    size: 200,
    enableSorting: false,
  }),

  columnHelper.accessor('classificator.stage', {
    id: 'stage',
    header: 'Этап',
    size: 200,
    enableSorting: false,
  }),
];
