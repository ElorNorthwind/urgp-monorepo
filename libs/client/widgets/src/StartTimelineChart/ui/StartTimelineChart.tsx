import { useOkrugTotals, useStartTimeline } from '@urgp/client/entities';
import {
  Button,
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
import {
  Bar,
  BarChart,
  BarProps,
  CartesianGrid,
  ReferenceLine,
  XAxis,
} from 'recharts';

const startTimelineChartConfig = {
  started: {
    label: 'Старт состоялся',
    color: 'hsl(var(--chart-3))',
  },
  planned: {
    label: 'Старт запланирован',
    color: '#cbd5e1', // 'hsl(var(--chart-3))',
  },
} satisfies ChartConfig;

type StartTimelineChartProps = {
  className?: string;
};

const StartTimelineChart = ({
  className,
}: StartTimelineChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useStartTimeline();

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 pb-2">
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-1 h-6 w-32" />
            <Skeleton className="mb-1 h-4 w-44" />
          </div>
        ) : (
          <CardTitle className="flex flex-row items-center justify-between">
            <span>График стартов</span>
          </CardTitle>
        )}
        {/* {isLoading || isFetching ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="h-16">
            Дома, запланированные к началу переселения
          </CardDescription>
        )} */}
      </CardHeader>
      <CardContent>
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-2 h-[200px] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={startTimelineChartConfig}
            className=" h-full w-full lg:h-[250px]"
          >
            <BarChart accessibilityLayer data={data}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="label"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                interval={0}
              />
              <ChartTooltip
                // defaultIndex={2}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value, payload) => {
                      return (
                        <div className="text-lg font-bold">
                          {value +
                            ' ' +
                            payload.find((entry) => {
                              return entry.payload.label === value;
                            })?.payload.year}
                        </div>
                      );
                    }}
                    formatter={(value, name, item, index, payload) => {
                      return (
                        <div className="flex w-[12rem] items-center gap-2">
                          <div
                            className="h-[.75rem] w-[.75rem] rounded"
                            style={{
                              backgroundColor: item.color,
                              opacity: value === 0 ? 0.2 : 1,
                            }}
                          />
                          <div
                            className={cn(
                              value === 0 && 'text-muted-foreground/20',
                            )}
                          >
                            {
                              startTimelineChartConfig[
                                name as keyof typeof startTimelineChartConfig
                              ]?.label
                            }
                          </div>
                          <div
                            className={cn(
                              'ml-auto font-bold',
                              value === 0 && 'text-muted-foreground/20',
                            )}
                          >
                            {value}
                          </div>
                        </div>
                      );
                    }}
                  />
                }
                // cursor={false}
              />

              {/* <ChartLegend content={<ChartLegendContent />} /> */}
              <ReferenceLine
                x={8}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              <Bar
                dataKey="started"
                stackId="a"
                fill="var(--color-started)"
                radius={[4, 4, 0, 0]}
              />
              <Bar
                dataKey="planned"
                stackId="a"
                fill="var(--color-planned)"
                radius={[4, 4, 0, 0]}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { StartTimelineChart };
