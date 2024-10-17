import { useNavigate } from '@tanstack/react-router';
import {
  useOkrugTotalDeviations,
  useOldBuildingsStartAndFinishMonthly,
  useOldBuildingsStartAndFinishYearly,
} from '@urgp/client/entities';
import {
  renderRechartsStackedBar,
  renderRechartsTooltip,
} from '@urgp/client/features';
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
import { set } from 'date-fns';
import { Calendar, CalendarDays, House, Users } from 'lucide-react';
import { useMemo, useState } from 'react';
import { BarChart, CartesianGrid, Line, LineChart, XAxis } from 'recharts';

const startAndFinishTimelineChartConfig = {
  starts: {
    label: 'Переселение начато',
    color: 'hsl(var(--chart-1))',
  },
  finishes: {
    label: 'Переселение окончено',
    color: 'hsl(var(--chart-2))',
  },
} satisfies ChartConfig;

type StartAndFinishTimelineChartProps = {
  className?: string;
};

const StartAndFinishTimelineChart = ({
  className,
}: StartAndFinishTimelineChartProps): JSX.Element => {
  const {
    data: yearly,
    isLoading: isLoadingYearly,
    isFetching: isFetchingYearly,
  } = useOldBuildingsStartAndFinishYearly();
  const {
    data: monthly,
    isLoading: isLoadingMonthly,
    isFetching: isFetchingMonthly,
  } = useOldBuildingsStartAndFinishMonthly();

  const [showMonthly, setShowMonthly] = useState(false);

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 pb-2">
        {isLoadingYearly ||
        isFetchingYearly ||
        isLoadingMonthly ||
        isFetchingMonthly ? (
          <div>
            <Skeleton className="mb-1 h-6 w-32" />
            <Skeleton className="mb-1 h-4 w-44" />
          </div>
        ) : (
          <CardTitle className="flex flex-row items-center justify-between">
            <span>Старты и завершения</span>
            <Button
              variant={'ghost'}
              className="h-6 py-0 px-1"
              onClick={() => setShowMonthly((value) => !value)}
            >
              <span
                className="flex flex-row items-center gap-1"
                style={{ color: 'hsl(var(--chart-1))' }}
              >
                {showMonthly ? (
                  <>
                    <Calendar className="h-4 w-4" />
                    <span className="hidden sm:block">
                      показать весь период
                    </span>
                  </>
                ) : (
                  <>
                    <CalendarDays className="h-4 w-4" />
                    <span className="hidden sm:block">
                      показать последнй год
                    </span>
                  </>
                )}
              </span>
            </Button>
          </CardTitle>
        )}
        {isLoadingYearly ||
        isFetchingYearly ||
        isLoadingMonthly ||
        isFetchingMonthly ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="h-16">
            Количество начатых и завершенных переселений
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="h-[200px]">
        {isLoadingYearly ||
        isFetchingYearly ||
        isLoadingMonthly ||
        isFetchingMonthly ? (
          <div>
            <Skeleton className="mb-2 h-[calc(100%-2rem)] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={startAndFinishTimelineChartConfig}
            className="h-full w-full"
          >
            <LineChart
              accessibilityLayer
              data={showMonthly ? monthly : yearly}
              margin={{ top: 10, right: 20, bottom: 0, left: 20 }}
            >
              <CartesianGrid vertical={false} />
              <XAxis
                dataKey="period"
                tickLine={false}
                tickMargin={10}
                axisLine={false}
                tickFormatter={
                  showMonthly ? (value) => value.slice(0, 3) : undefined
                }
                interval={showMonthly ? 0 : 0}
              />

              {renderRechartsTooltip({
                config: startAndFinishTimelineChartConfig,
                cursor: true,
              })}
              <ChartLegend content={<ChartLegendContent />} />

              <Line
                dataKey="starts"
                type="monotone"
                stroke="var(--color-starts)"
                strokeWidth={2}
                dot={true}
              />
              <Line
                dataKey="finishes"
                type="monotone"
                stroke="var(--color-finishes)"
                strokeWidth={2}
                dot={true}
              />
            </LineChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { StartAndFinishTimelineChart };
