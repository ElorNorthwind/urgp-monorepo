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
  OldBuilding,
  RenovationNewBuilding,
} from '@urgp/shared/entities';
import { format } from 'date-fns';
import { relocationAge } from '../../../oldBuildings';
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

// <HStack
//   gap="s"
//   align={'center'}
//   justify={'start'}
//   className="w-[180px] flex-nowrap"
// >
//   {decoration?.icon && <decoration.icon className={decoration.className} />}
//   <VStack gap="none" align={'start'}>
//     <div className="truncate whitespace-nowrap text-xs">
//       {props.row.original.buildingNewBuildingStatus}
//     </div>
//     <div className="text-muted-foreground truncate whitespace-nowrap text-xs">
//       {props.row.original.buildingDeviation}
//     </div>
//   </VStack>
// </HStack>

export { NewBuildingOldBuildingListCell };
