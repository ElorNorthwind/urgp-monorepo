import {
  cn,
  HStack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VStack,
} from '@urgp/client/shared';
import { OldBuilding } from '@urgp/shared/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';
import { useMemo } from 'react';

type DeviationChartProps = {
  building: {
    adress?: string;
    apartments: OldBuilding['apartments']['deviation'];
    total: OldBuilding['apartments']['total'];
  };
  className?: string;
  chartClassName?: string;
};

function DeviationChart(props: DeviationChartProps): JSX.Element {
  const { building, className, chartClassName } = props;
  const chartData = useMemo(
    () => [
      {
        value: building.apartments.risk,
        percent: Math.round((building.apartments.risk / building.total) * 100),
        key: 'risk',
        label: 'наступил риск',
        class: cn('bg-rose-400'),
      },
      {
        value: building.apartments.attention,
        percent: Math.round(
          (building.apartments.attention / building.total) * 100,
        ),
        key: 'attention',
        label: 'требует внимания',
        class: cn('bg-amber-400'),
      },
      {
        value: building.apartments.none,
        percent: Math.round((building.apartments.none / building.total) * 100),
        key: 'none',
        label: 'в работе по плану',
        class: cn('bg-sky-400'),
      },
      {
        value: building.apartments.mfr,
        percent: Math.round((building.apartments.mfr / building.total) * 100),
        key: 'mfr',
        label: 'в работе у МФР',
        class: cn('bg-violet-400'),
      },
      {
        value: building.apartments.done,
        percent: Math.round((building.apartments.done / building.total) * 100),
        key: 'done',
        label: 'работа завершена',
        class: cn('bg-emerald-500'),
      },
    ],
    [building],
  );

  if (building.total === 0) {
    return (
      <p
        className={cn(
          'text-muted-foreground h-10 text-center opacity-50',
          chartClassName,
        )}
      >
        переселение не начато
      </p>
    );
  }

  const deviationPercent =
    building.total > 0
      ? Math.round((building.apartments.risk / building.total) * 100)
      : 0;

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <HStack gap="s" className={cn('h-10', className)}>
          {building.apartments.risk > 0 ? (
            <div className="flex w-[30px] items-center justify-end text-right align-middle text-sm text-red-500">
              <b className="text-lg font-bold">{deviationPercent}</b>%
            </div>
          ) : (
            <div className="text-muted-foreground flex w-[30px] items-center justify-end text-right align-middle text-sm">
              <b className="mr-1 text-lg font-bold opacity-50">ок</b>
            </div>
          )}
          <div
            className={cn(
              'relative flex h-6 flex-1 justify-start overflow-hidden rounded-sm bg-slate-50 p-0 align-middle',
              chartClassName,
            )}
          >
            {chartData.map(
              (item) =>
                item.value > 0 && (
                  <div
                    key={item.key}
                    style={{
                      width: `${item.percent}%`,
                    }}
                    className={cn(
                      'm-0 flex h-full items-center justify-center text-xs font-bold text-white first:rounded-l-sm last:rounded-r-sm',
                      item.class,
                    )}
                  >
                    {item.percent > 10 ? item.value : ' '}
                  </div>
                ),
            )}
          </div>
        </HStack>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent className="p-0" side="left">
          <TooltipArrow />
          <Table>
            {building.adress && (
              <TableHeader>
                <TableRow className="bg-slate-50 text-center text-xs hover:bg-slate-50">
                  <TableHead
                    colSpan={3}
                    compact
                    className="min-w-[60px] truncate px-2 text-left"
                  >
                    {building.adress}
                  </TableHead>
                </TableRow>
              </TableHeader>
            )}
            <TableBody>
              {chartData.map(
                (item) =>
                  item.value > 0 && (
                    <TableRow className="text-muted-foreground " key={item.key}>
                      <TableCell
                        compact
                        className="px-2 py-1 text-center text-xs"
                      >
                        <div
                          className={cn('flex h-4 w-4 rounded', item.class)}
                        />
                      </TableCell>
                      <TableCell
                        compact
                        className="text-primary px-0 py-1  text-right text-xs font-bold"
                      >
                        {item.value}
                      </TableCell>
                      <TableCell compact className="py-1 text-left  text-xs">
                        {item.label}
                      </TableCell>
                    </TableRow>
                  ),
              )}
            </TableBody>
          </Table>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { DeviationChart };
