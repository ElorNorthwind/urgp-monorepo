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
  const [showNotStarted, setShowNotStarted] = useState(true);

  // if (isLoading) {
  //   return (
  //     <Card className={cn(className)}>
  //       <CardHeader className="space-y-0 overflow-clip pb-2">
  //         <Skeleton className="mb-1 h-4 w-16" />
  //         <CardTitle className="flex w-full flex-row flex-wrap justify-start gap-12 text-2xl tabular-nums">
  //           <div className="flex flex-col justify-start gap-1">
  //             <Skeleton className="h-10 w-24" />
  //             <Skeleton className="h-4 w-16" />
  //           </div>
  //           <div className="flex flex-col justify-start gap-1">
  //             <Skeleton className="h-8 w-20" />
  //             <Skeleton className="h-4 w-16" />
  //           </div>
  //           <div className="flex flex-col justify-start gap-1">
  //             <Skeleton className="h-8  w-20" />
  //             <Skeleton className="h-4 w-16" />
  //           </div>

  //           <div className="flex flex-col justify-start gap-1">
  //             <Skeleton className="h-8  w-20" />
  //             <Skeleton className="h-4 w-16" />
  //           </div>
  //         </CardTitle>
  //       </CardHeader>
  //       <CardContent className="relative">
  //         {/* <LoaderCircle className="stroke-muted-foreground absolute inset-0 z-10 m-auto h-16 w-16 animate-spin" /> */}
  //         <Skeleton className="min-h-[320px] w-full" />
  //         <Skeleton className="mx-auto mt-2 h-6 w-80" />
  //       </CardContent>
  //     </Card>
  //   );
  // }

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 pb-2">
        <CardTitle className="flex flex-row items-center justify-between">
          {isLoading ? (
            <Skeleton className="mb-1 h-6 w-32" />
          ) : (
            'Данные по округам'
          )}
          {isLoading ? (
            <Skeleton className="mb-1 h-4 w-44" />
          ) : (
            <Button
              variant={'ghost'}
              className="h-6 py-0 px-1"
              onClick={() => setShowNotStarted((value) => !value)}
            >
              <div
                className="flex flex-row items-center gap-1"
                style={{ color: 'hsl(var(--chart-1))' }}
              >
                {showNotStarted ? (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <div className="hidden sm:block">скрыть неначатые</div>
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4" />
                    <div className="hidden sm:block">показать неначатые</div>
                  </>
                )}
              </div>
            </Button>
          )}
        </CardTitle>
        <CardDescription className="h-16">
          {isLoading ? (
            <Skeleton className="h-4 w-60" />
          ) : (
            'Дома, включенные в программу Реновации'
          )}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {isLoading ? (
          <div>
            <Skeleton className="mb-2 h-[280px] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={okrugChartConfig}
            className="h-full w-full lg:h-[320px]"
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
        )}
      </CardContent>
    </Card>
  );
};

export { OkrugTotalsChart };
