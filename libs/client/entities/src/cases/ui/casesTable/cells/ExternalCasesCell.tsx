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
import { format } from 'date-fns';

function ExternalCasesCell(
  props: CellContext<CaseWithStatus, string>,
): JSX.Element {
  const externalCases = props.row.original.payload.externalCases;

  if (externalCases === undefined || externalCases.length === 0) {
    return <div className="text-muted-foreground line-clamp-1">-</div>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="text-muted-foreground line-clamp-1 flex items-start justify-start gap-1 truncate">
          {externalCases.slice(0, 2).map((c) => (
            <span className={cn('text-nowrap')} key={c.num || '' + c.id || ''}>
              {c.num || '-'}
            </span>
          ))}
          {externalCases.length > 2 && <span className="">...</span>}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex flex-col gap-1">
            <div className="font-bold">Заявки по делу:</div>
            {externalCases.map((c) => (
              <div
                // variant={'outline'}
                className="flex justify-between"
                key={c.num || '' + c.id || ''}
              >
                <span>
                  {(c.date &&
                    ' от ' + format(c.date, 'dd.MM.yyyy') + ' № ' + c.num) ||
                    'б/н'}
                </span>
                {c.system !== 'NONE' && (
                  <span className=" text-muted-foreground ml-2 font-normal">
                    {'(' + c.system + ')'}
                  </span>
                )}
              </div>
            ))}
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { ExternalCasesCell };
