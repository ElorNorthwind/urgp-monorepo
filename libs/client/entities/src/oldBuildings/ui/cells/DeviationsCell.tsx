import { CellContext } from '@tanstack/react-table';
import { OldBuilding } from '@urgp/shared/entities';
import { DeviationChart } from '../DeviationChart';

function DeviationsCell(props: CellContext<OldBuilding, string>): JSX.Element {
  const building = {
    adress: props.row.original.adress,
    total: props.row.original.apartments.total,
    apartments: props.row.original.apartments.deviation,
  };

  return <DeviationChart className="w-full" building={building} />;
}

export { DeviationsCell };
