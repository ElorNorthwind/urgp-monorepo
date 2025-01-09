import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Separator,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { format } from 'date-fns';
import { viewStatusStyles } from '../../../config/caseStyles';

function CaseDesctiptionCell(props: CellContext<Case, string>): JSX.Element {
  const controlCase = props.row.original;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex flex-1 flex-col items-start justify-start truncate">
          <div className="truncate">
            <span className="font-bold">{controlCase.payload.fio}</span>
            <span className="text-muted-foreground ml-2 w-full truncate border-l pl-2">
              {controlCase.payload.adress}
            </span>
          </div>
          <div className="w-full truncate text-xs">
            {controlCase.payload.description}
          </div>
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent side="bottom">
          <TooltipArrow />
          <div className="flex max-w-[300px] flex-col gap-0">
            <div className="font-bold">Данные заявки:</div>
            <div className="flex items-start justify-between">
              <span>ID:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {controlCase.id}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Автор:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {controlCase.author.fio}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Создана:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {format(controlCase.createdAt, 'dd.MM.yyyy HH:mm')}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Заявитель:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {controlCase.payload.fio}
              </span>
            </div>
            <div className="flex items-start justify-between">
              <span>Адрес:</span>
              <span className="text-muted-foreground ml-2 font-normal">
                {controlCase.payload.adress}
              </span>
            </div>
          </div>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { CaseDesctiptionCell };
