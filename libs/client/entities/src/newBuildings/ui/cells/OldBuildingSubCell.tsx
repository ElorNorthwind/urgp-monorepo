import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VStack,
} from '@urgp/client/shared';
import { relocationDeviations } from '@urgp/client/widgets';
import {
  NewBuilding,
  NewBuildingsSearch,
  OldBuilding,
  RenovationNewBuilding,
} from '@urgp/shared/entities';
import { format } from 'date-fns';
import { DeviationChart, relocationAge } from '../../../oldBuildings';
import { getRouteApi, useNavigate } from '@tanstack/react-router';

function OldBuildingSubCell(building: OldBuilding): JSX.Element {
  const navigate = useNavigate({ from: '/renovation/newbuildings' });
  const { selectedBuildingId } = getRouteApi(
    '/renovation/newbuildings',
  ).useSearch();

  const deviationIcon = relocationDeviations.find(
    (deviation) =>
      deviation.value === building.buildingDeviation ||
      deviation.label === building.buildingDeviation,
  );
  return (
    <div
      key={building.id}
      className={cn(
        'grid w-full grid-cols-[3fr_2fr_2fr] items-center gap-2 truncate p-2',
        'cursor-pointer rounded-sm border',
        selectedBuildingId === building.id
          ? 'bg-muted-foreground/10 hover:bg-muted-foreground/15 shadow-sm'
          : 'border-muted-foreground/10 hover:bg-muted-foreground/5',
      )}
      onClick={() => {
        navigate({
          search: (prev: NewBuildingsSearch) => ({
            ...prev,
            selectedBuildingId:
              building?.id === selectedBuildingId ? undefined : building?.id,
            apartment: undefined,
          }),
        });
      }}
    >
      <div className="flex flex-col truncate">
        <span className="w-full truncate">{building.adress}</span>
        <span className="text-muted-foreground w-full truncate text-xs">
          {building.relocationType}
        </span>
      </div>

      <div className="flex flex-row items-center gap-2 truncate">
        {deviationIcon?.icon && (
          <deviationIcon.icon className={deviationIcon.className} />
        )}
        <div className="flex flex-1 flex-col items-start justify-start truncate">
          <div className="truncate">
            <span>{building?.buildingRelocationStatus || 'Не начато'}</span>
          </div>
          <div className={cn('text-muted-foreground w-full truncate text-xs')}>
            <span>{building?.buildingDeviation || 'Без отклонений'}</span>
          </div>
        </div>
      </div>

      <DeviationChart
        className="w-full"
        building={{
          adress: building.adress,
          total: building.apartments.total,
          apartments: building.apartments.deviation,
        }}
      />
    </div>
  );
}

export { OldBuildingSubCell };
