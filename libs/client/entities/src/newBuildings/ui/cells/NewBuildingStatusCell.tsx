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

function NewBuildingStatusCell(
  props: CellContext<RenovationNewBuilding, string>,
): JSX.Element {
  const decoration = relocationDeviations.find(
    (deviation) =>
      deviation.value === props.row.original.plotDeviation ||
      deviation.label === props.row.original.plotDeviation,
  );
  const rowData = props.row.original;

  return (
    <div className="flex flex-row items-center gap-2 truncate">
      {decoration?.icon && <decoration.icon className={decoration.className} />}
      <div className="flex flex-1 flex-col items-start justify-start truncate">
        <div className="truncate">
          <span
          // className={cn(
          //   rowData?.actualPlotStart ? '' : 'text-muted-foreground',
          // )}
          >
            {rowData?.plotStatus || 'Освобождение не начато'}
          </span>
        </div>
        <div
          className={cn(
            'text-muted-foreground w-full truncate text-xs',
            // 'first:[&>*]:mr-1 first:[&>*]:border-r first:[&>*]:pr-1',
          )}
        >
          <span className="w-full truncate font-light">
            {rowData?.plotDeviation || 'Без отклонений'}
          </span>
        </div>
      </div>
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

export { NewBuildingStatusCell };
