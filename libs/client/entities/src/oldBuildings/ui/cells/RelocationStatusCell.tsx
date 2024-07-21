import { CellContext } from '@tanstack/react-table';
import { HStack, VStack } from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import {
  CircleAlert,
  CircleCheck,
  CircleEllipsis,
  CircleX,
} from 'lucide-react';

function RelocationStatusCell(
  props: CellContext<OldBuilding, string>,
): JSX.Element {
  const icon = {
    Завершено: <CircleCheck className="mr-2 h-6 w-6 text-emerald-500" />,
    'Без отклонений': <CircleEllipsis className="mr-2 h-6 w-6 text-blue-500" />,
    'Требует внимания': (
      <CircleAlert className="mr-2 h-6 w-6 text-yellow-500" />
    ),
    'Есть риски': <CircleX className="mr-2 h-6 w-6 text-red-500" />,
  }[props.row.original.buildingDeviation];

  return (
    <HStack
      gap="s"
      align={'center'}
      justify={'start'}
      className="w-max flex-nowrap "
    >
      {icon && icon}
      <VStack gap="none" align={'start'}>
        <div className="whitespace-nowrap  text-xs">
          {props.row.original.buildingDeviation}
        </div>
        <div className="whitespace-nowrap  text-xs">
          {props.row.original.buildingRelocationStatus}
        </div>
      </VStack>
    </HStack>
  );
}

export { RelocationStatusCell };
