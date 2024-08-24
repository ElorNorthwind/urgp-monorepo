import { useDoneTimeline } from '@urgp/client/entities';
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
  className?: string;
};

const DoneTimelineChart = ({
  className,
}: DoneTimelineChartProps): JSX.Element => {
  const { data: timeline, isLoading, isFetching } = useDoneTimeline();

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 pb-2">
        {isLoading || isFetching ? (
          <Skeleton className="mb-1 h-6 w-44" />
        ) : (
          <CardTitle>Ход переселения</CardTitle>
        )}
        {isLoading || isFetching ? (
          <Skeleton className="mb-1 h-4 w-64" />
        ) : (
          <CardDescription className="h-16">
            Число семей, отработанных ежемесячно
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-2 h-[280px] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={timelineChartConfig}
            className="h-full w-full lg:h-[320px]"
          >
            <AreaChart accessibilityLayer data={timeline}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="fullPeriod"
                tickLine={false}
                axisLine={false}
                minTickGap={0}
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
        )}
      </CardContent>
    </Card>
  );
};

export { DoneTimelineChart };
