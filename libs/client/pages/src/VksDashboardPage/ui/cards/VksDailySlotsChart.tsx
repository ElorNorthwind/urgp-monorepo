import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  useVksServiceStats,
  useVksDepartmentStats,
  useVksStatusStats,
  useVksTimeline,
  useVksDailySlotStats,
} from '@urgp/client/entities';
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
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { VksDepartmentFilter } from '@urgp/client/widgets';
import { VksDashbordPageSearch } from '@urgp/shared/entities';
import { format } from 'date-fns';
import { CalendarCheck, CalendarRange, ChartBarBig } from 'lucide-react';
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

const chartConfig = {
  slotsUsed: {
    label: 'Консультация оказана',
    color: 'hsl(var(--chart-2))',
  },
  slotsReserved: {
    label: 'Слот забронирован',
    color: 'hsl(var(--chart-3))',
  },
  slotsAvailable: {
    label: 'Слот не использован',
    color: '#9ca3af',
  },
} satisfies ChartConfig;

type ChartProps = {
  className?: string;
};

const VksDailySlotsChart = ({ className }: ChartProps): JSX.Element => {
  const pathname = useLocation().pathname;
  const search = getRouteApi(pathname).useSearch() as VksDashbordPageSearch;
  // const navigate = useNavigate({ from: pathname });

  const { data, isLoading, isFetching } = useVksDailySlotStats(search);
  const weekDays = ['пн', 'вт', 'ср', 'чт', 'пт'];
  const wdNames = {
    пн: 'Понедельник',
    вт: 'Вторник',
    ср: 'Среда',
    чт: 'Четверг',
    пт: 'Пятница',
  };

  return (
    <Card className={cn(className)}>
      <CardHeader className="relative flex flex-row items-start justify-start gap-2 space-y-0 pb-2">
        <CalendarRange className="-mt-1.5 size-12 flex-shrink-0" />
        <div className="flex-shrink-0">
          <CardTitle className="flex flex-row items-center justify-between">
            <span className="flex-shrink-0">
              Слоты записи по времени и дням недели
            </span>
          </CardTitle>

          <CardDescription className="">
            Число консультаций и доступных слотов
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent
      // style={{ height: (data?.length || 0) * 2.5 + 2 + 'rem' }}
      >
        {isLoading ? (
          <div>
            <Skeleton className="mb-2 h-[calc(100%-2rem)] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <div className={cn('h-full ', 'flex flex-row')}>
            {['пн', ...weekDays].map((day, i) => (
              <div
                className={cn(
                  'h-full flex-shrink flex-grow-0 p-2 odd:bg-gray-50',
                  i === 0 ? 'w-[100px]' : 'w-[calc(20%-20px)]',
                )}
              >
                <div className="w-full text-center font-semibold">
                  {i === 0 ? 'Время' : wdNames[day as keyof typeof wdNames]}
                </div>
                <ChartContainer
                  key={'chart-' + day}
                  config={chartConfig}
                  className="w-full"
                  style={{ height: (data?.length || 0) * 0.3 + 2 + 'rem' }}
                >
                  <BarChart
                    accessibilityLayer
                    data={data?.filter((item) => item.weekday === day)}
                    layout="vertical"
                    margin={{
                      top: 0,
                      right: 0,
                      left: 0,
                      bottom: 0,
                    }}
                    stackOffset="expand"
                  >
                    <CartesianGrid vertical={true} horizontal={false} />
                    <YAxis
                      dataKey="hour"
                      type="category"
                      tickLine={false}
                      axisLine={false}
                      tick={{ fontSize: 14 }}
                      tickMargin={5}
                      width={90}
                      interval={0}
                      hide={i > 0}
                    />
                    <XAxis
                      type="number"
                      // domain={[0, 'dataMax']}
                      allowDataOverflow={false}
                      hide
                      tickLine={false}
                      axisLine={false}
                    />
                    {renderRechartsTooltip({
                      config: chartConfig,
                      cursor: true,
                      labelWidth: '11rem',
                    })}
                    {i > 0 &&
                      renderRechartsStackedBar({
                        config: chartConfig,
                        data: data?.filter((item) => item.weekday === day),
                      })}
                  </BarChart>
                </ChartContainer>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { VksDailySlotsChart };
