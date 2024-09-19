import { useTotalAges } from '@urgp/client/entities';
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
import { CityTotalAgeInfo } from '@urgp/shared/entities';
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import {
  Bar,
  BarChart,
  BarProps,
  CartesianGrid,
  Cell,
  Label,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

const inProgressAgeChartConfig = {
  risk: {
    label: 'Имеются риски',
    color: 'hsl(var(--chart-1))', // '#f43f5e',
  },
  warning: {
    label: 'Требуют внимания',
    color: 'hsl(var(--chart-4))', // '#f59e0b',
  },
  none: {
    label: 'В работе по плану',
    color: 'hsl(var(--chart-3))', // '#06b6d4',
  },
} satisfies ChartConfig;

type inProgressAgesChartProps = {
  className?: string;
};

const InProgressAgesChart = ({
  className,
}: inProgressAgesChartProps): JSX.Element => {
  const [onlyFull, setOnlyFull] = useState(false);
  const { data, isLoading, isFetching } = useTotalAges(onlyFull);

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
            <span>Сроки по домам в работе</span>
            <Button
              variant={'ghost'}
              className="h-6 py-0 px-1"
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
          </CardTitle>
        )}
        {isLoading || isFetching ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="h-16">
            Как долго происходит переселение c фактической даты старта
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-2 h-[150px] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={inProgressAgeChartConfig}
            className="mt-[-35px] h-full w-full lg:h-[200px]"
          >
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              {/* <CartesianGrid horizontal={false} /> */}
              <YAxis
                dataKey="age"
                type="category"
                tickLine={false}
                // tickMargin={1}
                axisLine={false}
                tick={{ fontSize: 10 }}
                tickMargin={5}
                width={80}
                // tickFormatter={(value) => value.slice(0, 5)}
                interval={0}
              />
              <XAxis
                // dataKey={'done'}
                type="number"
                domain={[0, 'dataMax']}
                allowDataOverflow={false}
                hide
                tickLine={false}
                axisLine={false}
                // width={200}
              />
              <ChartTooltip
                // defaultIndex={2}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) => {
                      return <div className="text-lg font-bold">{value}</div>;
                    }}
                    formatter={(value, name, item, index, payload) => {
                      return (
                        <div className="w-[12rem]">
                          <div className="flex w-full items-center gap-2">
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
                                inProgressAgeChartConfig[
                                  name as keyof typeof inProgressAgeChartConfig
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
                          {index === 2 && (
                            <div className="text-foreground mt-1.5 flex w-full basis-full items-center border-t pt-1.5 text-xs font-medium">
                              ИТОГО
                              <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-bold">
                                {item.payload.none +
                                  item.payload.risk +
                                  item.payload.warning}
                              </div>
                            </div>
                          )}
                        </div>
                      );
                    }}
                  />
                }
                // cursor={false}
              />

              {Object.keys(inProgressAgeChartConfig).map((status) => {
                return (
                  <Bar
                    key={status}
                    dataKey={status}
                    fill={`var(--color-${status})`}
                    stackId="a"
                    radius={[0, 4, 4, 0]}
                    label={(props) => {
                      const { x, y, width, height, index } = props;
                      console.log(JSON.stringify(props, null, 2));
                      if (!data) return <></>;
                      const total = Object.values(data[index as number])
                        .filter((elem) => typeof elem === 'number')
                        .reduce((acc, curr) => acc + curr, 0);
                      const val =
                        data[index as number][status as keyof (typeof data)[0]];
                      return (
                        <text
                          x={x + width / 2}
                          y={y + height / 2}
                          dx={-5}
                          dy={4}
                          fill="white"
                          fontSize="12"
                          textAnchor="center"
                        >
                          {typeof val === 'number' &&
                          val / total > 0.08 &&
                          val > 1
                            ? val
                            : ''}
                        </text>
                      );
                    }}
                  >
                    {data &&
                      data.map((entry, index) => {
                        const keys = Object.keys(inProgressAgeChartConfig);
                        const keysSoFar = keys.slice(
                          0,
                          keys.findIndex((key) => key === status) + 1,
                        );

                        const total = keys.reduce((acc, curr) => {
                          const value = entry[curr as keyof typeof entry];
                          return (
                            acc +
                            (typeof value === 'number'
                              ? (value as number)
                              : parseInt(value as string))
                          );
                        }, 0);

                        const runningTotal = keysSoFar.reduce((acc, curr) => {
                          const value = entry[curr as keyof typeof entry];
                          return (
                            acc +
                            (typeof value === 'number'
                              ? (value as number)
                              : parseInt(value as string))
                          );
                        }, 0);

                        if (total === runningTotal) {
                          return <Cell key={`cell-${index}`}></Cell>;
                        }
                        return <Cell key={`cell-${index}`} radius={0}></Cell>;
                      })}
                    {/* <LabelList
                      dataKey="none"
                      position="center"
                      fontSize={10}
                      fill="white"
                      formatter={(value: number) => (value > 5 ? value : null)}
                    /> */}
                  </Bar>
                );
              })}
              <ChartLegend content={<ChartLegendContent />} />
              <ChartTooltip
                content={
                  <ChartTooltipContent
                    hideLabel
                    className="w-[180px]"
                    formatter={(value, name, item, index) => (
                      <>
                        <div
                          className="h-2.5 w-2.5 shrink-0 rounded-[2px] bg-[--color-bg]"
                          style={
                            {
                              '--color-bg': `var(--color-${name})`,
                            } as React.CSSProperties
                          }
                        />
                        {inProgressAgeChartConfig[
                          name as keyof typeof inProgressAgeChartConfig
                        ]?.label || name}
                        <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                          {value}
                          <span className="text-muted-foreground font-normal">
                            kcal
                          </span>
                        </div>
                        {/* Add this after the last item */}
                        {index === 1 && (
                          <div className="text-foreground mt-1.5 flex basis-full items-center border-t pt-1.5 text-xs font-medium">
                            Total
                            <div className="text-foreground ml-auto flex items-baseline gap-0.5 font-mono font-medium tabular-nums">
                              {item.payload.none +
                                item.payload.risk +
                                item.payload.warning}
                              <span className="text-muted-foreground font-normal">
                                kcal
                              </span>
                            </div>
                          </div>
                        )}
                      </>
                    )}
                  />
                }
                defaultIndex={1}
              />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { InProgressAgesChart };
