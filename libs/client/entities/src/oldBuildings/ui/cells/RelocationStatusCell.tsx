import { CellContext } from '@tanstack/react-table';
import { HStack, VStack } from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { relocationDeviations } from '../../config/classificators';

function RelocationStatusCell(
  props: CellContext<OldBuilding, string>,
): JSX.Element {
  const decoration = relocationDeviations.find(
    (deviation) => deviation.value === props.row.original.buildingDeviation,
  );

  return (
    <HStack
      gap="s"
      align={'center'}
      justify={'start'}
      className="w-[180px] flex-nowrap"
    >
      {decoration?.icon && <decoration.icon className={decoration.className} />}
      <VStack gap="none" align={'start'}>
        <div className="truncate whitespace-nowrap text-xs">
          {props.row.original.buildingRelocationStatus}
        </div>
        <div className="text-muted-foreground truncate whitespace-nowrap text-xs">
          {props.row.original.buildingDeviation}
        </div>
      </VStack>
    </HStack>
  );
}

export { RelocationStatusCell };
