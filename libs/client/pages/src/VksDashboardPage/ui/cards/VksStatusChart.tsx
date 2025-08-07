import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import { useVksStatusStats } from '@urgp/client/entities';
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
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { VksDashbordPageSearch } from '@urgp/shared/entities';
import { Shapes } from 'lucide-react';
import {
  BarChart,
  CartesianGrid,
  Label,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  XAxis,
  YAxis,
} from 'recharts';

const chartConfig = {
  обслужен: {
    label: 'обслужен',
    color: 'hsl(var(--chart-2))',
  },
  'отменено ОИВ': {
    label: 'отменено ОИВ',
    color: 'hsl(var(--chart-1))',
  },
} satisfies ChartConfig;

type ChartProps = {
  className?: string;
};

const VksStatusChart = ({ className }: ChartProps): JSX.Element => {
  const pathname = useLocation().pathname;
  const search = getRouteApi(pathname).useSearch() as VksDashbordPageSearch;
  const navigate = useNavigate({ from: pathname });

  const { data, isLoading, isFetching } = useVksStatusStats(search);

  return (
    <Card className={cn(className)}>
      <CardHeader className="relative flex flex-row items-start justify-start gap-2 space-y-0 pb-2">
        <Shapes className="-mt-1.5 size-12 flex-shrink-0" />
        <div className="flex-shrink-0">
          <CardTitle className="flex flex-row items-center justify-between">
            <span className="flex-shrink-0">Статус записей</span>
          </CardTitle>
          <CardDescription className="">
            Число записей в разрезе статуса
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent
        className=""
        style={{ height: (data?.length || 0) * 3 + 2 + 'rem' }}
      >
        {/* cy: 140,
      numberY: 0,
      textY: 16,
      endAngle: 180,
      startAngle: 540,
      marginStyle: '-mb-10 -mt-2', */}

        {isLoading ? (
          <div>
            <Skeleton className="mb-2 h-[calc(100%-2rem)] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full pt-0">
            <RadialBarChart
              data={data}
              endAngle={180}
              startAngle={540}
              innerRadius={100}
              outerRadius={180}
              cy={140}
            >
              {renderRechartsTooltip({
                config: chartConfig,
                // cursor: true,
                labelWidth: '16rem',
                // labelFormatter: () => {
                //   return <div className="text-lg font-bold">Всего заявок</div>;
                // },
              })}
              {/* <ChartTooltip
                      cursor={false}
                      content={<ChartTooltipContent hideLabel />}
                    /> */}
              <PolarRadiusAxis tick={false} tickLine={false} axisLine={false}>
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          // className="cursor-pointer"
                          // onClick={(data) =>
                          //   navigate({
                          //     to: './cases',
                          //     search: {
                          //       status: data?.status,
                          //     },
                          //   })
                          // }
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy || 0}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {isLoading || !data
                              ? '...'
                              : (1000).toLocaleString('ru-RU')}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy || 0}
                            className="fill-muted-foreground"
                          >
                            Всего заявок
                          </tspan>
                        </text>
                      );
                    } else {
                      return null;
                    }
                  }}
                />
              </PolarRadiusAxis>
              {Object.keys(chartConfig).map((key) => {
                return (
                  <RadialBar
                    key={key}
                    dataKey={key}
                    stackId="a"
                    fill={`var(--color-${key})`}
                    className="cursor-pointer stroke-transparent stroke-2"
                    // onClick={() =>
                    //   navigate({
                    //     to: './objects',
                    //     search: {
                    //       status:
                    //         action === 'give'
                    //           ? giveStatuses[key as keyof typeof giveStatuses]
                    //           : takeStatuses[key as keyof typeof takeStatuses],
                    //       type: [1],
                    //     },
                    //   })
                    // }
                  />
                );
              })}
            </RadialBarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { VksStatusChart };
