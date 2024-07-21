import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VStack,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';

function AreaCell(props: CellContext<OldBuilding, string>): JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger>
        <VStack
          gap={'none'}
          justify={'center'}
          align={'start'}
          className="w-[140px] text-left"
        >
          <div className="w-full truncate ">{props.row.original.okrug}</div>
          <div className="text-muted-foreground w-full truncate text-sm">
            {props.row.original.district}
          </div>
        </VStack>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <TooltipArrow />
          <p>
            <b>Округ:</b> {props.row.original.okrug}
          </p>
          <p>
            <b>Район:</b> {props.row.original.district}
          </p>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { AreaCell };
