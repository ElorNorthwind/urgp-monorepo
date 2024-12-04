import { CellContext } from '@tanstack/react-table';
import {
  Badge,
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseWithStatus } from '@urgp/shared/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { directionCategoryStyles } from '../../../config/caseStyles';

function DirectionCell(
  props: CellContext<CaseWithStatus, string>,
): JSX.Element {
  const payload = props.row.original.payload;
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="text-muted-foreground line-clamp-1 flex items-start justify-start gap-1 truncate">
          {payload.directions?.slice(0, 2).map((d) => (
            <Badge
              variant={'outline'}
              className={cn(
                'text-nowrap px-1',
                d.category && directionCategoryStyles[d.category].badgeStyle,
              )}
              key={d.id}
            >
              {d.name}
            </Badge>
          ))}
          {payload.directions?.length > 2 && (
            <Badge variant={'outline'} className="px-2">
              ...
            </Badge>
          )}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex flex-col gap-1">
            <div className="font-bold">Направления работы:</div>
            {payload.directions?.map((d) => (
              <div
                // variant={'outline'}
                className="flex justify-between"
                key={d.id}
              >
                <Badge
                  variant={'outline'}
                  className={cn(
                    d.category &&
                      directionCategoryStyles[d.category].badgeStyle,
                  )}
                >
                  {d.name}
                </Badge>
                <span className="text-muted-foreground ml-1 text-xs font-normal">
                  {'(' + d.category + ')'}
                </span>
              </div>
            ))}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { DirectionCell };
