import { useOkrugTotals } from '@urgp/client/entities';
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
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, XAxis } from 'recharts';

const okrugChartConfig = {
  done: {
    label: 'Отселено',
    color: 'hsl(var(--chart-2))',
  },
  inProgress: {
    label: 'В работе',
    color: 'hsl(var(--chart-3))',
  },
  notStarted: {
    label: 'Не начато',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type OkrugTotalsChartProps = {
  className?: string;
};

const OkrugTotalsChart = ({
  className,
}: OkrugTotalsChartProps): JSX.Element => {
  const { data: okrugs, isLoading, isFetching } = useOkrugTotals();

  const [showNotStarted, setShowNotStarted] = useState(true);

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
            <span>Данные по округам</span>
            <Button
              variant={'ghost'}
              className="h-6 py-0 px-1"
              onClick={() => setShowNotStarted((value) => !value)}
            >
              <span
                className="flex flex-row items-center gap-1"
                style={{ color: 'hsl(var(--chart-1))' }}
              >
                {showNotStarted ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span className="hidden sm:block">скрыть неначатые</span>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:block">показать неначатые</span>
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
            Дома, включенные в программу Реновации
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-2 h-[280px] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={okrugChartConfig}
            className="mt-[-35px] h-full w-full lg:h-[320px]"
          >
            <BarChart accessibilityLayer data={okrugs}>
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="okrug"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={(value) => value.slice(0, 5)}
                interval={0}
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
                        <div className="flex w-[8rem] items-center gap-2">
                          <div
                            className="h-[.75rem] w-[.75rem] rounded"
                            style={{ backgroundColor: item.color }}
                          />
                          <div>
                            {
                              okrugChartConfig[
                                name as keyof typeof okrugChartConfig
                              ]?.label
                            }
                          </div>
                          <div className="ml-auto font-bold">{value}</div>
                        </div>
                      );
                    }}
                  />
                }
                // cursor={false}
              />

              <ChartLegend content={<ChartLegendContent />} />

              <Bar
                dataKey="done"
                stackId="a"
                fill="var(--color-done)"
                radius={[0, 0, 0, 0]}
              />
              <Bar
                dataKey="inProgress"
                stackId="a"
                fill="var(--color-inProgress)"
                radius={showNotStarted ? [0, 0, 0, 0] : [4, 4, 0, 0]}
              />
              {showNotStarted && (
                <Bar
                  dataKey="notStarted"
                  stackId="a"
                  fill="var(--color-notStarted)"
                  radius={[4, 4, 0, 0]}
                />
              )}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { OkrugTotalsChart };
