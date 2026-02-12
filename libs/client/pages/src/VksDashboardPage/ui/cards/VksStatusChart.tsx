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
  ChartTooltip,
  ChartTooltipContent,
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { VksDashbordPageSearch } from '@urgp/shared/entities';
import { PieChartIcon, Shapes } from 'lucide-react';
import {
  BarChart,
  CartesianGrid,
  Label,
  Pie,
  PieChart,
  PolarRadiusAxis,
  RadialBar,
  RadialBarChart,
  Sector,
  XAxis,
  YAxis,
} from 'recharts';
import { PieSectorDataItem } from 'recharts/types/polar/Pie';

const chartConfig = {
  обслужен: {
    label: 'обслужен',
    color: '#0d9488',
  },
  забронировано: {
    label: 'забронировано',
    color: 'hsl(var(--chart-3))',
  },
  'отменено ОИВ': {
    label: 'отменено ОИВ',
    color: '#334155',
  },
  'отменено пользователем': {
    label: 'отменено пользователем',
    color: '#475569',
  },
  'талон не был взят': {
    label: 'талон не был взят',
    color: '#64748b',
  },
  'не явился по вызову': {
    label: 'не явился по вызову',
    color: 'hsl(var(--chart-1))',
  },
  'пустой слот': {
    label: 'пустой слот',
    color: '#adb3ba',
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

  const totalConsultations = data?.reduce((acc, item) => {
    return acc + item.count;
  }, 0);

  const dataWithFill = data?.map((item) => ({
    ...item,
    fill: chartConfig[item.status as keyof typeof chartConfig].color,
  }));

  return (
    <Card className={cn(className)}>
      <CardHeader className="relative flex flex-row items-start justify-start gap-2 space-y-0 pb-2">
        <PieChartIcon className="-mt-1.5 size-12 flex-shrink-0" />
        <div className="flex-shrink-0">
          <CardTitle className="flex flex-row items-center justify-between">
            <span className="flex-shrink-0">Статус записей</span>
          </CardTitle>
          <CardDescription className="">Состояние консультаций</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="relative">
        <div
          className="pointer-events-none absolute bottom-5 left-0 z-20 w-full px-5 text-center text-xl font-extrabold leading-none text-red-500 opacity-40"
          tabIndex={-1}
        >
          Информация о свободных слотах доступна в тестовом режиме
        </div>
        {isLoading ? (
          <div>
            <Skeleton className="mb-2 h-[calc(100%-2rem)] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={chartConfig}
            className="pt-0 lg:aspect-square"
          >
            <PieChart>
              {/* <ChartTooltip
                cursor={false}
                content={<ChartTooltipContent hideLabel />}
              /> */}
              {renderRechartsTooltip({
                config: chartConfig,
                cursor: false,
                labelWidth: '12rem',
              })}
              <Pie
                data={dataWithFill}
                dataKey="count"
                nameKey="status"
                innerRadius={80}
                outerRadius={110}
                strokeWidth={5}
                className="cursor-pointer"
                onClick={(data) => {
                  if (data) {
                    navigate({
                      to: './cases',
                      search: {
                        status: data.status,
                        dateFrom: search.dateFrom,
                        dateTo: search.dateTo,
                        department: search.department,
                      },
                    });
                  }
                }}
              >
                <Label
                  content={({ viewBox }) => {
                    if (viewBox && 'cx' in viewBox && 'cy' in viewBox) {
                      return (
                        <text
                          x={viewBox.cx}
                          y={viewBox.cy}
                          textAnchor="middle"
                          dominantBaseline="middle"
                        >
                          <tspan
                            x={viewBox.cx}
                            y={viewBox.cy}
                            className="fill-foreground text-4xl font-bold"
                          >
                            {totalConsultations?.toLocaleString('ru-RU') || '0'}
                          </tspan>
                          <tspan
                            x={viewBox.cx}
                            y={(viewBox.cy || 0) + 24}
                            className="fill-muted-foreground"
                          >
                            Консультаций
                          </tspan>
                        </text>
                      );
                    }
                  }}
                />
              </Pie>
            </PieChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { VksStatusChart };
