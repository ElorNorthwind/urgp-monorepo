import { CellContext } from '@tanstack/react-table';
import { VStack } from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';

function RelocationTypeCell(
  props: CellContext<OldBuilding, string>,
): JSX.Element {
  return (
    <VStack gap={'none'} justify={'center'} align={'start'} className="">
      <div className="whitespace-nowrap text-xs">{props.getValue()}</div>
      <div className="text-muted-foreground whitespace-nowrap text-xs">
        {props.row.original.buildingRelocationStartAge}
      </div>
    </VStack>
  );
}

export { RelocationTypeCell };
