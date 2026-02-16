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
  useVksAbility,
} from '@urgp/client/shared';
import { VksDepartmentFilter } from '@urgp/client/widgets';
import { VksDashbordPageSearch } from '@urgp/shared/entities';
import { format, subDays } from 'date-fns';
import { CalendarCheck, ChartBarBig } from 'lucide-react';
import {
  Area,
  AreaChart,
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

const VksDepartmentSlotsChart = ({ className }: ChartProps): JSX.Element => {
  const pathname = useLocation().pathname;
  const search = getRouteApi(pathname).useSearch() as VksDashbordPageSearch;
  const navigate = useNavigate({ from: pathname });
  const i = useVksAbility();
  const { slotsAvailable: undefined, ...limitedConfig } = chartConfig;
  const filteredConfig = i.can('read', 'VksEmptySlots')
    ? chartConfig
    : limitedConfig;

  const datedSearch = {
    dateFrom: search?.dateFrom || format(subDays(new Date(), 30), 'yyyy-MM-dd'),
    dateTo: search?.dateTo || format(new Date(), 'yyyy-MM-dd'),
    department: search?.department,
  };

  const { data, isLoading, isFetching } = useVksDepartmentStats(datedSearch);

  // const monthPercenage =
  //   differenceInDays(new Date(), startOfMonth(new Date())) / 30;

  return (
    <Card className={cn(className)}>
      <CardHeader className="relative flex flex-row items-start justify-start gap-2 space-y-0 pb-2">
        <ChartBarBig className="-mt-1.5 size-12 flex-shrink-0" />
        <div className="flex-shrink-0">
          <CardTitle className="flex flex-row items-center justify-between">
            <span className="flex-shrink-0">Записи по управлениям</span>
          </CardTitle>

          <CardDescription className="">
            Число консультаций и доступных слотов
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent
        className=""
        style={{ height: (data?.length || 0) * 2.5 + 2 + 'rem' }}
      >
        {isLoading ? (
          <div>
            <Skeleton className="mb-2 h-[calc(100%-2rem)] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={filteredConfig}
            className="h-full w-full pt-0"
          >
            <BarChart
              accessibilityLayer
              data={data}
              layout="vertical"
              margin={{ top: 0, right: 0, left: -5, bottom: 0 }}
            >
              <CartesianGrid vertical={true} horizontal={false} />
              <YAxis
                dataKey="department"
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
                // domain={[0, 'dataMax']}
                allowDataOverflow={false}
                hide
                tickLine={false}
                axisLine={false}
              />
              {renderRechartsTooltip({
                config: filteredConfig,
                cursor: true,
                labelWidth: '14rem',
              })}
              {renderRechartsStackedBar({
                config: filteredConfig,
                data,
                onClick: (data, index, status) => {
                  switch (status) {
                    case 'slotsUsed':
                      navigate({
                        to: './cases',
                        search: {
                          department: [data.id],
                          status: ['обслужен', 'не явился по вызову'],
                          dateFrom: search.dateFrom,
                          dateTo: search.dateTo,
                        },
                      });
                      break;
                    case 'slotsReserved':
                      navigate({
                        to: './cases',
                        search: {
                          department: [data.id],
                          status: ['забронировано'],
                          dateFrom: search.dateFrom,
                          dateTo: search.dateTo,
                        },
                      });
                      break;
                    case 'slotsAvailable':
                      navigate({
                        to: './cases',
                        search: {
                          department: [data.id],
                          status: ['пустой слот'],
                          dateFrom: search.dateFrom,
                          dateTo: search.dateTo,
                        },
                      });
                      break;
                  }
                },
              })}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { VksDepartmentSlotsChart };
