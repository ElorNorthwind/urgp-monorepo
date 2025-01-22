import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { CaseOrPending } from '@urgp/shared/entities';
import { ExternalCasesList } from '../../ExternalCasesList';

function ExternalCasesCell(
  props: CellContext<CaseOrPending, string>,
): JSX.Element {
  const externalCases = props.row.original?.payload?.externalCases;

  if (externalCases === undefined || externalCases?.length === 0) {
    return <div className="text-muted-foreground line-clamp-1">-</div>;
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="text-muted-foreground line-clamp-1 flex w-full flex-col items-start justify-start gap-0">
          {externalCases?.slice(0, 2).map((c) => (
            <div
              className={cn('w-full truncate text-nowrap')}
              key={c.num || '' + c.id || ''}
            >
              {c.num || '-'}
            </div>
          ))}
          {externalCases?.length > 2 && <span className="">...</span>}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex flex-col gap-1 p-1">
            <div className="font-bold">Заявки по делу:</div>
            <ExternalCasesList externalCases={externalCases} compact />
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { ExternalCasesCell };
