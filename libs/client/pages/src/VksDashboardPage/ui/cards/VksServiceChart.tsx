import { getRouteApi, useLocation, useNavigate } from '@tanstack/react-router';
import {
  useVksServiceStats,
  useVksDepartmentStats,
  useVksStatusStats,
  useVksTimeline,
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
import { CalendarCheck, ChartBarBig, Shapes, Star } from 'lucide-react';
import {
  Area,
  AreaChart,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  XAxis,
  YAxis,
} from 'recharts';

// const chartConfig = {
//   total: {
//     label: 'Число консультаций',
//     color: 'hsl(var(--chart-3))',
//   },
// } satisfies ChartConfig;

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

const VksServiceChart = ({ className }: ChartProps): JSX.Element => {
  const pathname = useLocation().pathname;
  const search = getRouteApi(pathname).useSearch() as VksDashbordPageSearch;
  const navigate = useNavigate({ from: pathname });

  const { data, isLoading, isFetching } = useVksServiceStats(search);

  // const monthPercenage =
  //   differenceInDays(new Date(), startOfMonth(new Date())) / 30;

  return (
    <Card className={cn(className)}>
      <CardHeader className="relative flex flex-row items-start justify-start gap-2 space-y-0 pb-2">
        <Shapes className="-mt-1.5 size-12 flex-shrink-0" />
        <div className="flex-shrink-0">
          <CardTitle className="flex flex-row items-center justify-between">
            <span className="flex-shrink-0">Записи по услугам</span>
          </CardTitle>
          <CardDescription className="">
            Число записей в разрезе услуг
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent
        className=""
        style={{ height: (data?.length || 0) * 3 + 2 + 'rem' }}
      >
        {isLoading ? (
          <div>
            <Skeleton className="mb-2 h-[calc(100%-2rem)] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer config={chartConfig} className="h-full w-full pt-0">
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 0, left: -5, bottom: 0 }}
            >
              <CartesianGrid vertical={true} horizontal={false} />
              <YAxis
                dataKey="service"
                type="category"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 14 }}
                tickMargin={5}
                width={210}
                interval={0}
              />
              <XAxis
                type="number"
                domain={[0, 5]}
                allowDataOverflow={false}
                hide
                tickLine={false}
                axisLine={false}
              />
              {renderRechartsTooltip({
                config: chartConfig,
                cursor: true,
              })}
              {renderRechartsStackedBar({
                config: chartConfig,
                data,
                onClick: (data) => {
                  navigate({
                    to: './cases',
                    search: {
                      service: [data.service],
                      dateFrom: search.dateFrom,
                      dateTo: search.dateTo,
                    },
                  });
                },
              })}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { VksServiceChart };
