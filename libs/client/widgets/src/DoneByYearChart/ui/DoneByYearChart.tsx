import { useDoneByYear } from '@urgp/client/entities';
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
import { Bar, BarChart, CartesianGrid, XAxis, YAxis } from 'recharts';

const doneAgeChartConfig = {
  '0': {
    label: 'менее месяца',
    color: '#34d399',
  },
  '1': {
    label: '1-2 месяца',
    color: '#a3e635',
  },
  '2': {
    label: '2-5 месяцев',
    color: '#fbbf24',
  },
  '5': {
    label: '3-5 месяцев',
    color: '#fb923c',
  },
  '8': {
    label: 'более 8 месяцев',
    color: '#f87171',
  },
} satisfies ChartConfig;

type DoneByYearChartProps = {
  className?: string;
};

const DoneByYearChart = ({ className }: DoneByYearChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useDoneByYear();

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
            <span>Сроки завершения домов</span>
          </CardTitle>
        )}
        {isLoading || isFetching ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="h-16">
            Динамика длительносии переселения по годам
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
            config={doneAgeChartConfig}
            className="mt-[-35px] h-full w-full lg:h-[200px]"
          >
            <BarChart
              accessibilityLayer
              data={data}
              margin={{ top: 10, right: 0, left: 0, bottom: -10 }}
            >
              <CartesianGrid
                vertical={true}
                verticalCoordinatesGenerator={(props) => {
                  return [
                    ...props.xAxis.domain.map(
                      (_: number, index: number) =>
                        index * (props.width / props.xAxis.domain.length),
                    ),
                    props.width,
                  ];
                }}
              />
              <XAxis dataKey={'year'} />
              <YAxis type="number" tickLine={false} axisLine={false} hide />
              <ChartTooltip
                defaultIndex={1}
                content={
                  <ChartTooltipContent
                    indicator="dot"
                    labelFormatter={(value) => {
                      return (
                        <div className="text-lg font-bold">
                          {`Завершено в ${value} г.`}
                        </div>
                      );
                    }}
                    formatter={(value, name, item, index) => {
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
                              doneAgeChartConfig[
                                name as keyof typeof doneAgeChartConfig
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
                cursor={{ fill: 'transparent' }}
              />
              {Object.keys(doneAgeChartConfig).map((key) => {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={`var(--color-${key})`}
                    radius={[4, 4, 0, 0]}
                    label={(props) => {
                      const { x, y, value, index } = props;
                      return (
                        <text
                          x={x}
                          y={y}
                          dy={-4}
                          dx={3}
                          fontSize="8"
                          textAnchor="center"
                        >
                          {data &&
                            value > 0 &&
                            `${Math.floor(
                              (value /
                                Object.keys(doneAgeChartConfig).reduce(
                                  (acc, curr) =>
                                    acc +
                                      data[index as number][
                                        curr as keyof (typeof data)['0']
                                      ] || 0,
                                  0,
                                )) *
                                100,
                            )}%`}
                        </text>
                      );
                    }}
                  ></Bar>
                );
              })}
              {/* <ChartLegend content={<ChartLegendContent />} /> */}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { DoneByYearChart };
