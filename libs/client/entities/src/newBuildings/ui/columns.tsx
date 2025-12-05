import { createColumnHelper } from '@tanstack/react-table';
import { RenovationNewBuilding } from '@urgp/shared/entities';
import { NewBuildingAdressCell } from './cells/NewBuildingAdressCell';
import { NewBuildingAgeCell } from './cells/NewBuildingAgeCell';
import { NewBuildingStatusCell } from './cells/NewBuildingStatusCell';
import { NewBuildingOldBuildingListCell } from './cells/NewBuildingOldBuildingListCell';

const columnHelper = createColumnHelper<RenovationNewBuilding>();

export const newBuildingsColumns = [
  columnHelper.accessor('adress', {
    id: 'adress',
    header: 'Адрес участка',
    size: 210,
    cell: (props) => {
      return <NewBuildingAdressCell {...props} />;
    },
  }),
  columnHelper.accessor('plotStartAge', {
    id: 'age',
    header: 'Срок',
    size: 140,
    cell: (props) => {
      return <NewBuildingAgeCell {...props} />;
    },
  }),
  columnHelper.accessor('plotStatus', {
    id: 'status',
    header: 'Статус',
    size: 180,
    cell: (props) => {
      return <NewBuildingStatusCell {...props} />;
    },
  }),
  columnHelper.accessor('buildingCount', {
    id: 'old-buildings',
    header: 'Сносимые дома',
    size: 500,
    cell: (props) => {
      return <NewBuildingOldBuildingListCell {...props} />;
    },
  }),
];
