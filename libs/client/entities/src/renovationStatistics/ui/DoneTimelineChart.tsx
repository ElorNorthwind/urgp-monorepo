import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartLegend,
  ChartLegendContent,
  ChartTooltip,
  ChartTooltipContent,
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { DoneTimelinePoint } from '@urgp/shared/entities';
import { Area, AreaChart, CartesianGrid, XAxis } from 'recharts';

const timelineChartConfig = {
  fast: {
    label: 'Быстрее 2 месяцев',
    color: 'hsl(var(--chart-2))',
  },
  slow: {
    label: 'Дольше 2 месяцев',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type DoneTimelineChartProps = {
  timeline: DoneTimelinePoint[];
  className?: string;
  isLoading?: boolean;
};

const DoneTimelineChart = ({
  timeline,
  className,
  isLoading = false,
}: DoneTimelineChartProps): JSX.Element => {
  if (isLoading)
    return (
      <Card className={cn(className)}>
        <CardHeader className="space-y-0 pb-2">
          <CardTitle>
            <Skeleton className="h-8 w-44" />
          </CardTitle>
          <CardDescription className="pt-2">
            <Skeleton className="h-6 w-80" />
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Skeleton className="min-h-[430px] w-full" />
          <Skeleton className="mx-auto mt-2 h-6 w-60" />
        </CardContent>
      </Card>
    );

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle>Ход переселения</CardTitle>
        <CardDescription className="h-16">
          Число семей, отработанных ежемесячно
        </CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={timelineChartConfig}
          className="min-h-[450px] max-w-full"
        >
          <AreaChart accessibilityLayer data={timeline}>
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="fullPeriod"
              tickLine={false}
              axisLine={false}
              tickMargin={0}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <ChartTooltip
              content={
                <ChartTooltipContent
                  labelFormatter={(value) => {
                    return <div className="text-lg font-bold">{value}</div>;
                  }}
                  formatter={(value, name, item, index, payload) => {
                    return (
                      <div className="flex w-[12rem] items-center gap-2">
                        <div
                          className="h-[.75rem] w-[.75rem] rounded"
                          style={{ backgroundColor: item.color }}
                        />
                        <div>
                          {
                            timelineChartConfig[
                              name as keyof typeof timelineChartConfig
                            ]?.label
                          }
                        </div>
                        <div className="ml-auto font-bold">{value}</div>
                      </div>
                    );
                  }}
                />
              }
              cursor={false}
            />

            <ChartLegend content={<ChartLegendContent />} />

            <defs>
              <linearGradient id="fillSlow" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-slow)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-slow)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillFast" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--color-fast)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--color-fast)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="fast"
              type="natural"
              fill="url(#fillFast)"
              fillOpacity={0.4}
              stroke="var(--color-fast)"
              stackId="a"
            />
            <Area
              dataKey="slow"
              type="natural"
              fill="url(#fillSlow)"
              fillOpacity={0.4}
              stroke="var(--color-slow)"
              stackId="a"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};

export { DoneTimelineChart };
