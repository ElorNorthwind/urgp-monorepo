import { CellContext } from '@tanstack/react-table';
import { HStack, VStack } from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { relocationAge } from '../../config/classificators';

function RelocationTypeCell(
  props: CellContext<OldBuilding, string>,
): JSX.Element {
  const decoration = relocationAge.find(
    (age) => age.value === props.row.original.buildingRelocationStartAge,
  );

  return (
    <HStack
      gap="s"
      align={'center'}
      justify={'start'}
      className="w-max flex-nowrap"
    >
      {decoration?.icon && <decoration.icon className={decoration.className} />}
      <VStack gap={'none'} justify={'center'} align={'start'} className="">
        <div className="truncate whitespace-nowrap text-xs">
          {props.row.original.relocationType}
        </div>
        <div className="text-muted-foreground truncate whitespace-nowrap text-xs">
          {props.row.original.buildingRelocationStartAge}
        </div>
      </VStack>
    </HStack>
  );
}

export { RelocationTypeCell };
