import { getRouteApi, useLocation } from '@tanstack/react-router';
import {
  useEquityTimeline,
  useVksDepartmentClassificator,
  useVksTimeline,
} from '@urgp/client/entities';
import { MultiSelect, renderRechartsTooltip } from '@urgp/client/features';
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
import { VksDepartmentFilter } from '@urgp/client/widgets';
import { VksCasesPageSearch } from '@urgp/shared/entities';
import { differenceInDays, format, startOfMonth } from 'date-fns';
import { CalendarCheck } from 'lucide-react';
import { useState } from 'react';
import { Area, AreaChart, CartesianGrid, ReferenceLine, XAxis } from 'recharts';

const chartConfig = {
  housing: {
    label: 'Жилищные вопросы',
    color: '#0d9488',
  },
  nonHousing: {
    label: 'Земля и нежильё',
    color: '#475569',
  },
} satisfies ChartConfig;

type MonthlyProgressTimelineChartProps = {
  className?: string;
};

const VksTimelineChart = ({
  className,
}: MonthlyProgressTimelineChartProps): JSX.Element => {
  const pathname = useLocation().pathname;
  const search = getRouteApi(pathname).useSearch() as VksCasesPageSearch;

  const { data, isLoading, isFetching } = useVksTimeline(search?.department);

  // const monthPercenage =
  //   differenceInDays(new Date(), startOfMonth(new Date())) / 30;

  return (
    <Card className={cn(className)}>
      <CardHeader className="relative flex flex-row items-center justify-start gap-2 space-y-0 pb-2">
        <CalendarCheck className="-mt-1.5 size-12 flex-shrink-0" />
        <div className="flex-shrink-0">
          <CardTitle className="flex flex-row items-center justify-between">
            <span className="flex-shrink-0">Динамика записей</span>
          </CardTitle>

          <CardDescription className="">
            Количество онлайн-консультаций по месяцам
          </CardDescription>
        </div>
        <VksDepartmentFilter
          className="ml-auto flex-shrink flex-grow-0"
          overrideDefaultWidth
          fullBadge
          variant={'popover'}
        />
      </CardHeader>
      <CardContent className="h-[280px]">
        {isLoading ? (
          <div>
            <Skeleton className="mb-2 h-[calc(100%-2rem)] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full pt-0">
            <AreaChart
              accessibilityLayer
              // data={data?.map((p) =>
              //   p?.period === 'На сегодня'
              //     ? {
              //         ...p,
              //         housing: Math.floor(p.housing / monthPercenage),
              //         nonHousing: Math.floor(p.nonHousing / monthPercenage),
              //       }
              //     : p,
              // )}
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
                  value === 'На сегодня'
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

export { VksTimelineChart };
