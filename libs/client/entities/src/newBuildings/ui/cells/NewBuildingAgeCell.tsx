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

function NewBuildingAgeCell(
  props: CellContext<RenovationNewBuilding, string>,
): JSX.Element {
  const decoration = relocationAge.find(
    (age) => age.value === props.row.original?.plotStartAge,
  );
  const rowData = props.row.original;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-row items-center gap-2 truncate">
          {decoration?.icon && (
            <decoration.icon
              className={cn('size-8 flex-shrink-0', decoration.className)}
            />
          )}
          <div className="flex flex-1 flex-col items-start justify-start truncate">
            <div className="truncate">
              <span
                className={cn(
                  rowData?.actualPlotStart ? '' : 'text-muted-foreground',
                )}
              >
                {rowData?.actualPlotStart
                  ? format(rowData?.actualPlotStart, 'dd.MM.yyyy')
                  : rowData?.planPlotStart
                    ? '[' + format(rowData?.planPlotStart, 'dd.MM.yyyy') + ']'
                    : '-'}
              </span>
            </div>
            <div
              className={cn(
                'text-muted-foreground w-full truncate text-xs',
                // 'first:[&>*]:mr-1 first:[&>*]:border-r first:[&>*]:pr-1',
              )}
            >
              <span className="w-full truncate font-light">
                {rowData?.plotStartAge || 'Не начато'}
              </span>
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <TooltipArrow />
          {/* <h2 className="font-semibold">{rowData.adress}</h2> */}
          {rowData?.actualPlotStart ? (
            <p>
              <b>Старт отселения первого дома: </b>
              {format(rowData?.actualPlotStart, 'dd.MM.yyyy')}
            </p>
          ) : rowData?.planPlotStart ? (
            <p className="text-muted-foreground">
              <b>Старт отселения первого дома (план): </b>
              {format(rowData?.planPlotStart, 'dd.MM.yyyy')}
            </p>
          ) : null}
          {rowData?.actualPlotDone ? (
            <p>
              <b>Конец отселения последнего дома: </b>
              {format(rowData?.actualPlotDone, 'dd.MM.yyyy')}
            </p>
          ) : rowData?.planPlotDone ? (
            <p className="text-muted-foreground">
              <b>Конец отселения последнего дома (план): </b>
              {format(rowData?.planPlotDone, 'dd.MM.yyyy')}
            </p>
          ) : null}
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
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

export { NewBuildingAgeCell };
