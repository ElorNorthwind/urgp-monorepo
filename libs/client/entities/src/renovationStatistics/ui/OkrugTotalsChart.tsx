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
} from '@urgp/client/shared';
import { OkrugTotals } from '@urgp/shared/entities';
import { Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';
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
  okrugs: OkrugTotals[];
  className?: string;
  isLoading?: boolean;
};

const OkrugTotalsChart = ({
  okrugs,
  className,
  isLoading = false,
}: OkrugTotalsChartProps): JSX.Element => {
  const totals = useMemo(
    () =>
      okrugs?.reduce(
        (acc, cur) => ({
          total: acc.total + cur.total,
          done: acc.done + cur.done,
          inProgress: acc.inProgress + cur.inProgress,
          notStarted: acc.notStarted + cur.notStarted,
        }),
        { total: 0, done: 0, inProgress: 0, notStarted: 0 },
      ) ?? 0,
    [okrugs],
  );

  const [showNotStarted, setShowNotStarted] = useState(true);

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 overflow-clip pb-2">
        <CardDescription>Домов:</CardDescription>
        <CardTitle className="flex w-full flex-row flex-wrap justify-start gap-12 text-2xl tabular-nums">
          <div className="flex flex-col gap-0">
            <div className="text-muted-foreground text-4xl ">
              {totals.total}
            </div>
            <div className="text-muted-foreground relative top-[-.25rem] font-sans text-sm font-normal tracking-normal">
              всего
            </div>
          </div>
          <div className="flex flex-col gap-0">
            <div style={{ color: 'hsl(var(--chart-2))' }}>{totals.done}</div>
            <div className="text-muted-foreground relative top-[-.25rem] font-sans text-sm font-normal tracking-normal">
              отселено
            </div>
          </div>
          <div className="flex flex-col gap-0">
            <div style={{ color: 'hsl(var(--chart-3))' }}>
              {totals.inProgress}
            </div>
            <div className="text-muted-foreground relative top-[-.25rem] font-sans text-sm font-normal tracking-normal">
              в работе
            </div>
          </div>

          <div className="flex flex-col gap-0">
            <div style={{ color: 'hsl(var(--chart-1))' }}>
              {totals.notStarted}
              <Button
                variant={'ghost'}
                className="ml-2 h-6 w-6 p-0"
                onClick={() => setShowNotStarted((value) => !value)}
              >
                {showNotStarted ? (
                  <EyeOff className="h-max w-max" />
                ) : (
                  <Eye className="h-max w-max" />
                )}
              </Button>
            </div>
            <div className="text-muted-foreground relative top-[-.25rem] font-sans text-sm font-normal tracking-normal">
              не начато
            </div>
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={okrugChartConfig}
          className="min-h-[450px] max-w-full"
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
              cursor={false}
            />

            <ChartLegend content={<ChartLegendContent />} />

            <Bar
              dataKey="done"
              stackId="a"
              fill="var(--color-done)"
              radius={[0, 0, 4, 4]}
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
      </CardContent>
    </Card>
  );
};

export { OkrugTotalsChart };
