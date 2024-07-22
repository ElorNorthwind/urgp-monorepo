import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  cn,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VStack,
} from '@urgp/client/shared';
import { CellContext } from '@tanstack/react-table';
import { OldBuilding } from '@urgp/shared/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';

function DeviationsCell(props: CellContext<OldBuilding, string>): JSX.Element {
  const chartData = [
    {
      value: props.row.original.apartments.deviation.risk,
      percent: Math.round(
        (props.row.original.apartments.deviation.risk /
          props.row.original.apartments.total) *
          100,
      ),
      key: 'risk',
      label: 'наступил риск',
      class: cn('bg-rose-400'),
    },
    {
      value: props.row.original.apartments.deviation.attention,
      percent: Math.round(
        (props.row.original.apartments.deviation.attention /
          props.row.original.apartments.total) *
          100,
      ),
      key: 'attention',
      label: 'требует внимания',
      class: cn('bg-amber-400'),
    },
    {
      value: props.row.original.apartments.deviation.none,
      percent: Math.round(
        (props.row.original.apartments.deviation.none /
          props.row.original.apartments.total) *
          100,
      ),
      key: 'none',
      label: 'в работе по плану',
      class: cn('bg-sky-400'),
    },
    {
      value: props.row.original.apartments.deviation.done,
      percent: Math.round(
        (props.row.original.apartments.deviation.done /
          props.row.original.apartments.total) *
          100,
      ),
      key: 'done',
      label: 'работе завершена',
      class: cn('bg-emerald-500'),
    },
  ];

  if (props.row.original.apartments.total === 0) {
    return (
      <p className="text-muted-foreground w-full text-center opacity-50">
        переселение не начато
      </p>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger className="h-10 w-full">
        <div className="w-min-[220px] relative flex h-6 w-full justify-start overflow-clip rounded bg-slate-50 p-0 align-middle">
          {chartData.map(
            (item) =>
              item.value > 0 && (
                <div
                  key={item.key}
                  style={{
                    width: `${item.percent}%`,
                  }}
                  className={cn(
                    'm-0 flex h-full items-center justify-center text-xs font-bold text-white',
                    item.class,
                  )}
                >
                  {item.percent > 10 ? item.value : ' '}
                </div>
              ),
          )}
        </div>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <TooltipArrow />
          <VStack gap={'none'} justify={'center'} align={'start'}>
            <p className="text-muted-foreground">{props.row.original.adress}</p>
            {chartData.map(
              (item) =>
                item.value > 0 && (
                  <HStack gap={'s'} key={item.key}>
                    <div className={cn('h-4 w-2 rounded-sm', item.class)} />
                    <div className="">
                      <b>{item.value}</b> - {item.label}
                    </div>
                  </HStack>
                ),
            )}
          </VStack>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { DeviationsCell };
