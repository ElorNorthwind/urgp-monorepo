import { CellContext } from '@tanstack/react-table';
import {
  Badge,
  cn,
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseWithStatus } from '@urgp/shared/entities';
import { caseTypeStyles } from '../../../config/caseTypeStyles';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';

function DirectionCell(
  props: CellContext<CaseWithStatus, string>,
): JSX.Element {
  const payload = props.row.original.payload;
  const { icon: TypeIcon, className: typeClassName } =
    caseTypeStyles[payload.type.id];
  // const navigate = useNavigate({ from: '/control/cases' });

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex w-full flex-row items-center justify-start gap-2">
          <TypeIcon className={cn('h-6 w-6', typeClassName)} />
          <div className="flex flex-1 flex-col items-start justify-start truncate">
            <div className="truncate">{payload.type.name}</div>
            <div className="text-muted-foreground line-clamp-1 flex items-start justify-center gap-1">
              {payload.directions?.slice(0, 2).map((d) => (
                <Badge
                  variant={'outline'}
                  className="h-4 rounded-md p-1"
                  key={d.id}
                >
                  {d.name}
                </Badge>
              ))}
              {payload.directions?.length > 2 && (
                <Badge variant={'outline'} className="h-4 rounded-md p-1">
                  ...
                </Badge>
              )}
            </div>
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="left">
          <TooltipArrow />
          <div className="flex flex-col">
            <div>
              <span className="font-bold">Тип: </span>{' '}
              <span>{payload.type.fullname}</span>
            </div>
            <div className="flex gap-1">
              {payload.directions?.map((d) => (
                <Badge
                  variant={'outline'}
                  className="h-4 rounded-md p-1"
                  key={d.id}
                >
                  <span>{d.name}</span>
                  <span className="text-muted-foreground ml-1 text-xs font-normal">
                    {'(' + d.category + ')'}
                  </span>
                </Badge>
              ))}
            </div>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { DirectionCell };
