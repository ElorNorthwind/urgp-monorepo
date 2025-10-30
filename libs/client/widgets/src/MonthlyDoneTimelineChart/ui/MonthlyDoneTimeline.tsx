import {
  useMonthlyDone,
  useMonthlyProgress,
  useYearlyDone,
} from '@urgp/client/entities';
import {
  renderRechartsStackedBar,
  renderRechartsTooltip,
} from '@urgp/client/features';
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
import { format } from 'date-fns';
import { CircleDot, CirclePercent, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
  Area,
  AreaChart,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

const monthlyDoneTimelineChartConfig = {
  '0': {
    label: 'Быстрее 5 месяцев',
    color: 'hsl(var(--chart-2))',
  },
  '5': {
    label: 'От 5 до 8 месяцев',
    color: 'hsl(var(--chart-4))',
  },
  '8': {
    label: 'Дольше 8 месяцев',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type MonthlyDoneTimelineChartProps = {
  className?: string;
};

const MonthlyDoneTimelineChart = ({
  className,
}: MonthlyDoneTimelineChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useMonthlyDone();
  const {
    data: dataYear,
    isLoading: isLoadingYear,
    isFetching: isFetchingYear,
  } = useYearlyDone();
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
            <span>{'Динамика завершения отселений'}</span>
            <Button
              variant={'ghost'}
              className="ml-auto h-6 px-1 py-0"
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
              className="ml-2 h-6 px-1 py-0"
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
            {'Количество домов, по которым завершено отселение' +
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
          <div className="flex h-full flex-row">
            <ChartContainer
              config={monthlyDoneTimelineChartConfig}
              className="h-full flex-grow pt-0"
            >
              <AreaChart
                accessibilityLayer
                data={
                  onlyFull
                    ? data?.map((entry) => {
                        return {
                          ...entry,
                          '0': entry['0f'],
                          '5': entry['5f'],
                          '8': entry['8f'],
                        };
                      })
                    : data
                }
                margin={{ top: 10, right: 15, bottom: 0, left: 15 }}
                stackOffset={expand ? 'expand' : 'none'} // 'sign' | 'expand' | 'none' | 'wiggle' | 'silhouette' | 'positive';
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
                  config: monthlyDoneTimelineChartConfig,
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
                  {Object.keys(monthlyDoneTimelineChartConfig).map((key) => {
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
                {Object.keys(monthlyDoneTimelineChartConfig).map((key) => {
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

            <ChartContainer
              config={monthlyDoneTimelineChartConfig}
              className="hidden h-full w-1/3 flex-grow-0 lg:block"
            >
              <BarChart
                accessibilityLayer
                data={
                  onlyFull
                    ? dataYear?.map((entry) => {
                        return {
                          ...entry,
                          '0': entry['0f'],
                          '5': entry['5f'],
                          '8': entry['8f'],
                        };
                      })
                    : dataYear
                }
                layout="vertical"
                margin={{ top: 0, right: 0, left: -20, bottom: 44 }}
                stackOffset={expand ? 'expand' : 'none'}
              >
                <YAxis
                  dataKey="year"
                  type="category"
                  tickLine={false}
                  axisLine={false}
                  tick={{ fontSize: 10 }}
                  tickMargin={5}
                  width={72}
                  interval={0}
                />
                <XAxis
                  type="number"
                  domain={[0, 'dataMax']}
                  allowDataOverflow={false}
                  hide
                  tickLine={false}
                  axisLine={false}
                />
                {renderRechartsTooltip({
                  config: monthlyDoneTimelineChartConfig,
                  cursor: true,
                  labelWidth: '16rem',
                  labelFormatter: (label, payload) => {
                    return (
                      <div className="text-lg font-bold">
                        {'За ' + payload[0].payload.year + ' год'}
                      </div>
                    );
                  },
                })}
                {renderRechartsStackedBar({
                  config: monthlyDoneTimelineChartConfig,
                  data: onlyFull
                    ? dataYear?.map((entry) => {
                        return {
                          ...entry,
                          '0': entry['0f'],
                          '5': entry['5f'],
                          '8': entry['8f'],
                        };
                      })
                    : dataYear,
                })}
              </BarChart>
            </ChartContainer>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { MonthlyDoneTimelineChart };
