import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { CellContext } from '@tanstack/react-table';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';
import {
  EquityOperationLogItem,
  EquityRgStatuses,
} from '@urgp/shared/entities';
import { format } from 'date-fns';
import { Circle, Hand } from 'lucide-react';
import {
  equityObjectStatusStyles,
  equityOpinionsStyles,
} from '../../../../equityClassificators';

function EquityOperationProgressCell(
  props: CellContext<EquityOperationLogItem, number>,
): JSX.Element {
  const rowData = props.row?.original;

  const { icon: RgPrepIcon, iconStyle: rgPrepIconStyle } =
    rowData?.rgStatus !== EquityRgStatuses.none
      ? equityObjectStatusStyles[8]
      : { icon: Circle, iconStyle: cn('text-gray-200') };

  const { icon: UrgpOpinionIcon, iconStyle: urgpOpinionStyle } =
    rowData?.opinionUrgp === 'нет'
      ? { icon: Hand, iconStyle: cn('text-gray-200') }
      : equityOpinionsStyles[rowData?.opinionUrgp] ||
        Object.values(equityOpinionsStyles)[0];

  const { icon: RgResultIcon, iconStyle: rgResultIconStyle } =
    rowData?.rgStatus === EquityRgStatuses.rejection
      ? equityObjectStatusStyles[9]
      : rowData?.rgStatus === EquityRgStatuses.decision
        ? equityObjectStatusStyles[10]
        : { icon: Circle, iconStyle: cn('text-gray-200') };

  return (
    <div className="flex w-full flex-row gap-2 text-xs [&>*]:size-8 [&>*]:flex-shrink-0">
      {RgPrepIcon && (
        <Tooltip>
          <TooltipTrigger asChild>
            <RgPrepIcon className={cn(rgPrepIconStyle)} />
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />
              <div className="flex max-w-[450px] flex-col gap-0">
                {rowData?.rgPrepDate ? (
                  <>
                    <div className="font-bold">Подготовка на РГ</div>
                    <div className="flex items-start justify-between">
                      <span>Дата:</span>
                      <span className="text-muted-foreground ml-2 font-normal">
                        {rowData?.rgPrepDate &&
                          format(rowData?.rgPrepDate, 'dd.MM.yyyy')}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="">Не выносилось на РГ</div>
                )}
              </div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}

      {UrgpOpinionIcon && (
        <Tooltip>
          <TooltipTrigger asChild>
            <UrgpOpinionIcon className={cn(urgpOpinionStyle)} />
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />
              <div className="flex max-w-[450px] flex-col gap-0">
                {rowData?.urgpNotes ? (
                  <>
                    <div className="font-bold">Заключение УРЖП</div>
                    <div className="flex items-start justify-between">
                      <span>Дата:</span>
                      <span className="text-muted-foreground ml-2 font-normal">
                        {rowData?.urgpDate &&
                          format(rowData?.urgpDate, 'dd.MM.yyyy')}
                      </span>
                    </div>
                    <div className="flex items-start justify-between">
                      <span>Вывод:</span>
                      <span className="text-muted-foreground ml-2 font-normal">
                        {rowData?.opinionUrgp || 'не определено'}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="">Не рассматривалось УРЖП</div>
                )}
              </div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}

      {RgResultIcon && (
        <Tooltip>
          <TooltipTrigger asChild>
            <RgResultIcon className={cn(rgResultIconStyle)} />
          </TooltipTrigger>
          <TooltipPortal>
            <TooltipContent side="bottom">
              <TooltipArrow />
              <div className="flex max-w-[450px] flex-col gap-0">
                {rowData?.rgStatus === EquityRgStatuses.decision ? (
                  <>
                    <div className="font-bold">Рассмотрено на РГ</div>
                    <div className="flex items-start justify-between">
                      <span>Дата:</span>
                      <span className="text-muted-foreground ml-2 font-normal">
                        {rowData?.rgDecisionDate &&
                          format(rowData?.rgDecisionDate, 'dd.MM.yyyy')}
                      </span>
                    </div>
                  </>
                ) : rowData?.rgStatus === EquityRgStatuses.rejection ? (
                  <>
                    <div className="font-bold">Снято с рассмотрения РГ</div>
                    <div className="flex items-start justify-between">
                      <span>Дата:</span>
                      <span className="text-muted-foreground ml-2 font-normal">
                        {rowData?.rgRejectionDate &&
                          format(rowData?.rgRejectionDate, 'dd.MM.yyyy')}
                      </span>
                    </div>
                  </>
                ) : (
                  <div className="">Решение РГ не вынесено</div>
                )}
              </div>
            </TooltipContent>
          </TooltipPortal>
        </Tooltip>
      )}
    </div>
  );
}

export { EquityOperationProgressCell };
