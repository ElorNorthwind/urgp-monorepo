import { useGetRatesUsage } from '@urgp/client/entities';
import { BarRow } from '@urgp/client/features';
import {
  cn,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@urgp/client/shared';

type DailyRatesUsageBarProps = {
  className?: string;
  barClassName?: string;
};

const DailyRatesUsageBar = (props: DailyRatesUsageBarProps): JSX.Element => {
  const { className, barClassName } = props;
  const { data: usage, isLoading: isUsageLoading } = useGetRatesUsage();

  return (
    <div className={cn('flex flex-col items-start gap-2', className)}>
      <Tooltip>
        <TooltipTrigger className="w-full">
          <BarRow
            value={usage?.fias ?? 0}
            max={100}
            isLoading={isUsageLoading}
            label={
              <div className="flex w-full flex-row justify-between text-xs">
                <span>{`Расход запросов к ФИАС`}</span>
                <span>{`${usage?.fias || 0}%`}</span>
              </div>
            }
            labelFit="full"
            className={cn('bg-muted-foreground/10 h-5 w-full', barClassName)}
            barClassName={'bg-cyan-400'}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {`Направлено запросов: ${(usage?.fiasCount || 0).toLocaleString('ru-RU')} из 100 000`}
        </TooltipContent>
      </Tooltip>

      <Tooltip>
        <TooltipTrigger className="w-full">
          <BarRow
            value={usage?.dadata ?? 0}
            max={100}
            isLoading={isUsageLoading}
            label={
              <div className="flex w-full flex-row justify-between text-xs">
                <span>{`Расход запросов к DaData`}</span>
                <span>{`${usage?.dadata || 0}%`}</span>
              </div>
            }
            labelFit="full"
            className={cn('bg-muted-foreground/10 h-5 w-full', barClassName)}
            barClassName={'bg-red-400'}
          />
        </TooltipTrigger>
        <TooltipContent side="bottom">
          {`Направлено запросов: ${(usage?.dadataCount || 0).toLocaleString()} из 10 000`}
        </TooltipContent>
      </Tooltip>
    </div>
  );
};

export { DailyRatesUsageBar };
