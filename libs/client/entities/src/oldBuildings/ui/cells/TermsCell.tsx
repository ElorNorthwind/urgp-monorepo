import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  formatDate,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VStack,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { OldBuildingTermsTable } from '../OldBuildingTermsTable';

function TermsCell(
  props: CellContext<OldBuilding, string | null>,
): JSX.Element {
  return (
    <Tooltip>
      <TooltipTrigger>
        <VStack
          gap="none"
          align={'center'}
          justify={'center'}
          className="w-[80px]"
        >
          <div className="text-muted-foreground flex w-full place-content-center text-xs opacity-70">
            {formatDate(props.row.original.terms.plan.firstResetlementStart)}
          </div>
          <div className="flex w-full place-content-center text-xs">
            {formatDate(props.row.original.terms?.actual.firstResetlementStart)}
          </div>
        </VStack>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="p-0">
          <TooltipArrow />
          <OldBuildingTermsTable terms={props.row.original.terms} />
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { TermsCell };
