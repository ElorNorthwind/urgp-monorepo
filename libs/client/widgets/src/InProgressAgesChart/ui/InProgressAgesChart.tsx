import { useTotalAges } from '@urgp/client/entities';
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
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

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
  const { data, isLoading, isFetching } = useTotalAges();

  return (
    <Card className={cn('relative', cn(className))}>
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
              data={
                data && onlyFull
                  ? data.map((entry) => ({
                      ...entry,
                      none: entry.full,
                    }))
                  : data
              }
              layout="vertical"
              margin={{ top: 0, right: 0, left: 0, bottom: 0 }}
            >
              <YAxis
                dataKey="age"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 10 }}
                tickMargin={5}
                width={80}
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
              {renderRechartsTooltip({ config: inProgressAgeChartConfig })}
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
                          {width > 12 ? val : ''}
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
                  </Bar>
                );
              })}
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { InProgressAgesChart };
