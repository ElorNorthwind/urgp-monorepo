import { useDoneByYear } from '@urgp/client/entities';
import {
  renderRechartsStackedBar,
  renderRechartsTooltip,
} from '@urgp/client/features';
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
import {
  Bar,
  BarChart,
  CartesianGrid,
  LabelList,
  XAxis,
  YAxis,
} from 'recharts';

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
            <Skeleton className="mb-2 h-[200px] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={doneAgeChartConfig}
            className="mt-[-35px] h-full w-full lg:h-[250px]"
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
              <XAxis dataKey={'year'} tickLine={false} axisLine={false} />
              <YAxis
                type="number"
                tickLine={false}
                axisLine={false}
                hide
                domain={[0, 'dataMax + 15']}
              />
              {renderRechartsTooltip({
                config: doneAgeChartConfig,
                cursor: { fill: 'transparent' },
              })}
              {Object.keys(doneAgeChartConfig).map((key) => {
                return (
                  <Bar
                    key={key}
                    dataKey={key}
                    fill={`var(--color-${key})`}
                    radius={[4, 4, 0, 0]}
                    label={(props) => {
                      const { x, y, width, value, index } = props;
                      return (
                        <text
                          y={y}
                          x={x + width / 2}
                          dy={-4}
                          fontSize="8"
                          textAnchor="middle"
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
                  >
                    <LabelList
                      formatter={(value: number) => (value > 20 ? value : null)}
                      position="inside"
                      className="fill-white/60"
                      fontSize={8}
                    />
                  </Bar>
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
