import { Bar, BarChart, XAxis, YAxis } from 'recharts';
import {
  ChartConfig,
  ChartContainer,
  HStack,
  Tooltip,
  TooltipContent,
  TooltipTrigger,
  VStack,
} from '@urgp/client/shared';
import { CellContext } from '@tanstack/react-table';
import { OldBuilding } from '@urgp/shared/entities';
import { TooltipArrow, TooltipPortal } from '@radix-ui/react-tooltip';

const chartConfig = {
  risk: {
    label: 'Риск',
    color: 'hsl(var(--chart-1))',
  },
  attention: {
    label: 'Внимание',
    color: 'hsl(var(--chart-4))',
  },
  none: {
    label: 'В работе',
    color: 'hsl(var(--chart-3))',
  },
  done: {
    label: 'Завершено',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

function DeviationsCell(props: CellContext<OldBuilding, string>): JSX.Element {
  const chartData = [
    {
      name: 'Квартиры',
      done: props.row.original.apartments.deviation.done,
      none: props.row.original.apartments.deviation.none,
      attention: props.row.original.apartments.deviation.attention,
      risk: props.row.original.apartments.deviation.risk,
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
        <ChartContainer config={chartConfig} className="h-10 w-full">
          <BarChart accessibilityLayer data={chartData} layout="vertical">
            <XAxis type="number" hide domain={[0, 'dataMax']} />
            <YAxis type="category" dataKey="name" hide />
            <Bar
              dataKey="risk"
              stackId="a"
              //   radius={[4, 4, 0, 0]}
              fill={chartConfig.risk.color}
            />
            <Bar
              dataKey="attention"
              stackId="a"
              fill={chartConfig.attention.color}
              //   radius={[4, 4, 0, 0]}
            />
            <Bar
              dataKey="none"
              stackId="a"
              fill={chartConfig.none.color}
              //   radius={[0, 0, 4, 4]}
            />
            <Bar
              dataKey="done"
              stackId="a"
              fill={chartConfig.done.color}
              //   radius={[4, 4, 0, 0]}
            />
          </BarChart>
        </ChartContainer>
      </TooltipTrigger>
      <TooltipPortal>
        <TooltipContent>
          <TooltipArrow />
          <VStack gap={'none'} justify={'center'} align={'start'}>
            <p className="text-muted-foreground">{props.row.original.adress}</p>
            {chartData[0].risk > 0 && (
              <HStack gap={'s'}>
                <div
                  className="h-4 w-2 rounded-sm"
                  style={{ background: chartConfig.risk.color }}
                />
                <div className="">
                  <b style={{ color: chartConfig.risk.color }}>
                    {chartData[0].risk}
                  </b>{' '}
                  - наступил риск
                </div>
              </HStack>
            )}
            {chartData[0].attention > 0 && (
              <HStack gap={'s'}>
                <div
                  className="h-4 w-2 rounded-sm"
                  style={{ background: chartConfig.attention.color }}
                />
                <div className="">
                  <b style={{ color: chartConfig.attention.color }}>
                    {chartData[0].attention}
                  </b>{' '}
                  - требует внимания
                </div>
              </HStack>
            )}
            {chartData[0].none > 0 && (
              <HStack gap={'s'}>
                <div
                  className="h-4 w-2 rounded-sm"
                  style={{ background: chartConfig.none.color }}
                />
                <div className="">
                  <b style={{ color: chartConfig.none.color }}>
                    {chartData[0].none}
                  </b>{' '}
                  - в работе по плану
                </div>
              </HStack>
            )}
            {chartData[0].done > 0 && (
              <HStack gap={'s'}>
                <div
                  className="h-4 w-2 rounded-sm"
                  style={{ background: chartConfig.done.color }}
                />
                <div className="">
                  <b style={{ color: chartConfig.done.color }}>
                    {chartData[0].done}
                  </b>{' '}
                  - работа завершена
                </div>
              </HStack>
            )}
          </VStack>
        </TooltipContent>
      </TooltipPortal>
    </Tooltip>
  );
}

export { DeviationsCell };
