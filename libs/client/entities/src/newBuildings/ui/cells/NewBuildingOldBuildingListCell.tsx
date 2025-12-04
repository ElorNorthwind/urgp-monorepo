import { CellContext } from '@tanstack/react-table';
import { OldBuilding, RenovationNewBuilding } from '@urgp/shared/entities';
import { OldBuildingSubCell } from './OldBuildingSubCell';

function NewBuildingOldBuildingListCell(
  props: CellContext<RenovationNewBuilding, number>,
): JSX.Element {
  const rowData = props.row.original;

  return (
    <div className="flex w-full flex-col items-center gap-2 truncate p-0">
      {rowData?.oldBuildings?.map((building: OldBuilding) => (
        <OldBuildingSubCell key={building.id} {...building} />
      ))}
    </div>
  );
}

export { NewBuildingOldBuildingListCell };
