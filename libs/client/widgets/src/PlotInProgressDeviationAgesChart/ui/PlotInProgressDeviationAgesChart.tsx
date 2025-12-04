import { useNavigate } from '@tanstack/react-router';
import { useNewBuildingsDeviationTotals } from '@urgp/client/entities';
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
import { BarChart, XAxis, YAxis } from 'recharts';

const inProgressAgeChartConfig = {
  risk: {
    label: 'Имеются риски',
    color: 'hsl(var(--chart-1))', // '#f43f5e',
  },
  attention: {
    label: 'Требуют внимания',
    color: 'hsl(var(--chart-4))', // '#f59e0b',
  },
  ok: {
    label: 'В работе по плану',
    color: 'hsl(var(--chart-3))', // '#06b6d4',
  },
} satisfies ChartConfig;

type PlotInProgressDeviationAgesChartProps = {
  className?: string;
};

const PlotInProgressDeviationAgesChart = ({
  className,
}: PlotInProgressDeviationAgesChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useNewBuildingsDeviationTotals();
  const navigate = useNavigate({ from: '/renovation' });

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
            <span>Сроки работы по освобождению участков</span>
          </CardTitle>
        )}
        {isLoading || isFetching ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="h-16">
            Как долго происходит переселение c даты старта первого дома
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
            className="mt-[-35px] h-full w-full lg:h-[240px]"
          >
            <BarChart
              accessibilityLayer
              data={data}
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
                width={72}
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
              {renderRechartsTooltip({
                config: inProgressAgeChartConfig,
                cursor: true,
              })}
              {renderRechartsStackedBar({
                config: inProgressAgeChartConfig,
                data: data || [],
                // onClick: (data) => {
                //   navigate({
                //     to: './oldbuildings',
                //     search: {
                //       relocationAge: [data.age],
                //       deviation: 'Наступили риски',
                //     },
                //   });
                // },
              })}
              {/* <ChartLegend content={<ChartLegendContent />} /> */}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { PlotInProgressDeviationAgesChart };
