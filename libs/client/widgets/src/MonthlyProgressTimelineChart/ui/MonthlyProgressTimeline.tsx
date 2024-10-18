import { useMonthlyProgress } from '@urgp/client/entities';
import { renderRechartsTooltip } from '@urgp/client/features';
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
  cn,
  Skeleton,
} from '@urgp/client/shared';
import exp from 'constants';
import { format } from 'date-fns';
import { CircleDot, CirclePercent, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis } from 'recharts';

const monthlyProgressTimelineChartConfig = {
  lastM: {
    label: 'В рабое менее месяца',
    color: 'hsl(var(--chart-3))',
  },
  oneToEightM: {
    label: 'В работе от 1 до 8 месяцев',
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
  const [onlyFull, setOnlyFull] = useState(false);
  const [expand, setExpand] = useState(false);

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
            <span>{'Динамика домов в работе'}</span>
            <Button
              variant={'ghost'}
              className="ml-auto h-6 py-0 px-1"
              onClick={() => setOnlyFull((value) => !value)}
            >
              <span
                className="flex flex-row items-center gap-1"
                style={{ color: 'hsl(var(--chart-1))' }}
              >
                {onlyFull ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:block">показать неполное</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span className="hidden sm:block">скрыть неполное</span>
                  </>
                )}
              </span>
            </Button>
            <Button
              variant={'ghost'}
              className="ml-2 h-6 py-0 px-1"
              onClick={() => setExpand((value) => !value)}
            >
              <span
                className="flex flex-row items-center gap-1"
                style={{ color: 'hsl(var(--chart-1))' }}
              >
                {expand ? (
                  <>
                    <CircleDot className="h-4 w-4" />
                    <span className="hidden sm:block">по значениям</span>
                  </>
                ) : (
                  <>
                    <CirclePercent className="h-4 w-4" />
                    <span className="hidden sm:block">по долям</span>
                  </>
                )}
              </span>
            </Button>
          </CardTitle>
        )}
        {isLoading || isFetching ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="">
            {'Количество домов в работе на начало месяца' +
              (onlyFull ? '' : ' (включая частичное и поэтапное)')}
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
              data={
                onlyFull
                  ? data?.map((entry) => {
                      return {
                        ...entry,
                        lastM: entry.lastMf,
                        oneToEightM: entry.oneToEightMf,
                        eightToTwelveM: entry.eightToTwelveMf,
                        gtTwelveM: entry.gtTwelveMf,
                      };
                    })
                  : data
              }
              margin={{ top: 10, right: 15, bottom: 0, left: 15 }}
              stackOffset={expand ? 'expand' : 'none'}
              // stackOffset="expand" // 'sign' | 'expand' | 'none' | 'wiggle' | 'silhouette' | 'positive';
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
                <linearGradient id="fillLastM" x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="5%"
                    stopColor="var(--color-lastM)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-lastM)"
                    stopOpacity={0.1}
                  />
                </linearGradient>
                <linearGradient
                  id="fillOneToEightM"
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop
                    offset="5%"
                    stopColor="var(--color-oneToEightM)"
                    stopOpacity={0.8}
                  />
                  <stop
                    offset="95%"
                    stopColor="var(--color-oneToEightM)"
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
                dataKey="lastM"
                type="natural"
                fill="url(#fillLastM)"
                fillOpacity={0.4}
                stroke="var(--color-lastM)"
                stackId="a"
              />
              <Area
                dataKey="oneToEightM"
                type="natural"
                fill="url(#fillOneToEightM)"
                fillOpacity={0.4}
                stroke="var(--color-oneToEightM)"
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
