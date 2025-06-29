import { useEquityTimeline } from '@urgp/client/entities';
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
import { CalendarCheck } from 'lucide-react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis } from 'recharts';

const chartConfig = {
  taken: {
    label: 'Передано Москве',
    color: '#2563eb',
  },
  given: {
    label: 'Передано дольщикам',
    color: '#16a34a',
  },
} satisfies ChartConfig;

type MonthlyProgressTimelineChartProps = {
  className?: string;
};

const MonthlyProgressTimelineChart = ({
  className,
}: MonthlyProgressTimelineChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useEquityTimeline();

  return (
    <Card className={cn(className)}>
      <CardHeader className="flex flex-row items-center gap-2 space-y-0 pb-2">
        {isLoading || isFetching ? (
          <Skeleton className="size-12 flex-shrink-0 rounded-md" />
        ) : (
          <CalendarCheck className="-mt-1.5 size-12 flex-shrink-0" />
        )}
        <div>
          {isLoading || isFetching ? (
            <div>
              <Skeleton className="mb-1 h-6 w-32" />
              <Skeleton className="mb-1 h-4 w-44" />
            </div>
          ) : (
            <CardTitle className="flex flex-row items-center justify-between">
              <span>Динамика передачи объектов</span>
            </CardTitle>
          )}
          {isLoading || isFetching ? (
            <Skeleton className="h-4 w-60" />
          ) : (
            <CardDescription className="">
              Количество переданных объектов по месяцам
            </CardDescription>
          )}
        </div>
      </CardHeader>
      <CardContent className="h-[280px]">
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-2 h-[calc(100%-2rem)] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full pt-0">
            <AreaChart
              accessibilityLayer
              data={data}
              margin={{ top: 10, right: 15, bottom: 0, left: 15 }}
              //   stackOffset={expand ? 'expand' : 'none'} // 'sign' | 'expand' | 'none' | 'wiggle' | 'silhouette' | 'positive';
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) =>
                  value === 'Июнь 2025'
                    ? format(new Date(), 'dd.MM')
                    : value.slice(0, 3)
                }
                interval={0}
              />
              {renderRechartsTooltip({
                config: chartConfig,
                cursor: true,
                labelWidth: '16rem',
              })}

              <ReferenceLine
                x={data && data[data.length - 1].period}
                orientation={'horizontal'}
                stroke="hsl(var(--muted-foreground))"
                strokeDasharray="3 3"
                strokeWidth={1}
              />
              {data?.map(({ period }) => {
                if (period.includes('Январь')) {
                  return (
                    <ReferenceLine
                      key={period}
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
                {Object.keys(chartConfig).map((key) => {
                  return (
                    <linearGradient
                      key={`gradient-${key}`}
                      id={`fill${key}`}
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor={`var(--color-${key})`}
                        stopOpacity={0.8}
                      />
                      <stop
                        offset="95%"
                        stopColor={`var(--color-${key})`}
                        stopOpacity={0.1}
                      />
                    </linearGradient>
                  );
                })}
              </defs>
              {Object.keys(chartConfig).map((key) => {
                return (
                  <Area
                    dataKey={key}
                    key={key}
                    type="monotone"
                    fill={`url(#fill${key})`}
                    fillOpacity={0.4}
                    stroke={`var(--color-${key})`}
                    stackId="a"
                  />
                );
              })}
            </AreaChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { MonthlyProgressTimelineChart };
