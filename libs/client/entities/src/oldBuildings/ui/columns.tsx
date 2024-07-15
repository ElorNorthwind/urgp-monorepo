import { ColumnDef } from '@tanstack/react-table';
import { OldBuilding } from '@urgp/shared/entities';

export const oldBuildingsColumns: ColumnDef<OldBuilding>[] = [
  {
    accessorKey: 'okrug',
    header: 'Округ',
  },
  {
    accessorKey: 'district',
    header: 'Район',
  },
  {
    accessorKey: 'adress',
    header: 'Адрес',
  },
  {
    accessorKey: 'relocationType',
    header: 'Тип переселения',
  },
  {
    accessorKey: 'totalApartments',
    header: 'Всего квартир',
  },
];
