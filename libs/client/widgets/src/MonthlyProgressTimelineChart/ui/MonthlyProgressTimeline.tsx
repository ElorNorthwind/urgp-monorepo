import { useMonthlyProgress } from '@urgp/client/entities';
import { renderRechartsTooltip } from '@urgp/client/features';
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
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { format } from 'date-fns';
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis } from 'recharts';

const monthlyProgressTimelineChartConfig = {
  ltThreeM: {
    label: 'В рабое меньше 3 месяцев',
    color: 'hsl(var(--chart-3))',
  },
  threeToEightM: {
    label: 'В работе от 3 до 8 месяцев',
    color: 'hsl(var(--chart-2))',
  },
  eightToTwelveM: {
    label: 'В работе от 8 до 12 месяцев',
    color: 'hsl(var(--chart-4))',
  },
  gtTwelveM: {
    label: 'В работе больше года',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type MonthlyProgressTimelineChartProps = {
  className?: string;
};

const MonthlyProgressTimelineChart = ({
  className,
}: MonthlyProgressTimelineChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useMonthlyProgress();

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
            <span>Динамика домов в работе</span>
          </CardTitle>
        )}
        {isLoading || isFetching ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="">
            Количество домов в работе на начало месяца
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="h-[380px]">
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-2 h-[calc(100%-2rem)] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={monthlyProgressTimelineChartConfig}
            className="h-full w-full pt-0"
          >
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ top: 10, right: 15, bottom: 0, left: 15 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  value === 'На сегодня'
                    ? format(new Date(), 'dd.MM')
                    : value.slice(0, 3)
                }
                interval={0}
              />
              {renderRechartsTooltip({
                config: monthlyProgressTimelineChartConfig,
                cursor: true,
                labelWidth: '16rem',
              })}

              <ReferenceLine
                x={'На сегодня'}
                orientation={'horizontal'}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              {data?.map(({ period }) => {
                if (period.includes('Январь')) {
                  return (
                    <ReferenceLine
                      x={period}
                      orientation={'horizontal'}
                      stroke="hsl(var(--muted-foreground))"
                      strokeDasharray="3 3"
                      strokeWidth={1}
                      strokeOpacity={0.3}
                    />
                  );
                }
                return null;
              })}
              <ChartLegend content={<ChartLegendContent />} />
              <defs>
                <linearGradient id="fillLtThreeM" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-ltThreeM)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-ltThreeM)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillThreeToEightM"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-threeToEightM)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-threeToEightM)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillEightToTwelveM"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-eightToTwelveM)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-eightToTwelveM)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient id="fillGtTwelveM" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-gtTwelveM)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-gtTwelveM)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
              </defs>
              <Area
                dataKey="ltThreeM"
                type="natural"
                fill="url(#fillLtThreeM)"
                fillOpacity={0.4}
                stroke="var(--color-ltThreeM)"
                stackId="a"
              />
              <Area
                dataKey="threeToEightM"
                type="natural"
                fill="url(#fillThreeToEightM)"
                fillOpacity={0.4}
                stroke="var(--color-threeToEightM)"
                stackId="a"
              />
              <Area
                dataKey="eightToTwelveM"
                type="natural"
                fill="url(#fillEightToTwelveM)"
                fillOpacity={0.4}
                stroke="var(--color-eightToTwelveM)"
                stackId="a"
              />
              <Area
                dataKey="gtTwelveM"
                type="natural"
                fill="url(#fillGtTwelveM)"
                fillOpacity={0.4}
                stroke="var(--color-gtTwelveM)"
                stackId="a"
              />
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { MonthlyProgressTimelineChart };
