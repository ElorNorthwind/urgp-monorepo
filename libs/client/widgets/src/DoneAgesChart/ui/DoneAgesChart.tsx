import { useTotalAges } from '@urgp/client/entities';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { Bar, BarChart, XAxis, YAxis } from 'recharts';

const doneAgeChartConfig = {
  done: {
    label: 'Работа завершена',
    color: 'hsl(var(--chart-2))', //'#10b981',
  },
} satisfies ChartConfig;

type DoneAgesChartProps = {
  className?: string;
};

const DoneAgesChart = ({ className }: DoneAgesChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useTotalAges();

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
            <span>Сроки по завершенным домам</span>
          </CardTitle>
        )}
        {isLoading || isFetching ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="h-16">
            Как долго шло переселение с фактической даты старта
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-2 h-[130px] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={doneAgeChartConfig}
            className="mt-[-35px] h-full w-full lg:h-[180px]"
          >
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 0, left: -20, bottom: 0 }}
            >
              {/* <CartesianGrid
                horizontal={false}
                horizontalCoordinatesGenerator={(props) => [
                  0,
                  props.height / 5,
                  (props.height / 5) * 2,
                  (props.height / 5) * 3,
                  (props.height / 5) * 4,
                  props.height,
                ]}
              /> */}
              <YAxis
                dataKey="age"
                type="category"
                tickLine={false}
                // tickMargin={1}
                axisLine={false}
                tick={{ fontSize: 10 }}
                tickMargin={5}
                width={80}
                style={{ whiteSpace: 'nowrap' }}
                // tickFormatter={(value) => value.slice(0, 5)}
                interval={0}
              />
              <XAxis
                dataKey={'done'}
                type="number"
                // domain={[0, 'dataMax + 50']}
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
                // cursor={false}
                cursor={{ fill: 'transparent' }}
              />
              <Bar
                dataKey={'done'}
                layout="vertical"
                fill="var(--color-done)"
                radius={[0, 4, 4, 0]}
              >
                {/* <LabelList dataKey={'age'} position="left" offset={8} /> */}
                {/* <LabelList dataKey={'done'} position="right" /> */}
              </Bar>
              {/* <ChartLegend content={<ChartLegendContent />} /> */}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { DoneAgesChart };
