import { useNavigate } from '@tanstack/react-router';
import { useTotalAges } from '@urgp/client/entities';
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
import { Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { Bar, BarChart, Cell, XAxis, YAxis } from 'recharts';

const inProgressAgeChartConfig = {
  risk: {
    label: 'Имеются риски',
    color: 'hsl(var(--chart-1))', // '#f43f5e',
  },
  warning: {
    label: 'Требуют внимания',
    color: 'hsl(var(--chart-4))', // '#f59e0b',
  },
  none: {
    label: 'В работе по плану',
    color: 'hsl(var(--chart-3))', // '#06b6d4',
  },
} satisfies ChartConfig;

type inProgressAgesChartProps = {
  className?: string;
};

const InProgressAgesChart = ({
  className,
}: inProgressAgesChartProps): JSX.Element => {
  const [onlyFull, setOnlyFull] = useState(false);
  const { data, isLoading, isFetching } = useTotalAges();
  const navigate = useNavigate();

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
            <span>Сроки по домам в работе</span>
            <Button
              variant={'ghost'}
              className="h-6 py-0 px-1"
              onClick={() => setOnlyFull((value) => !value)}
            >
              <span
                className="flex flex-row items-center gap-1"
                style={{ color: 'hsl(var(--chart-1))' }}
              >
                {onlyFull ? (
                  <>
                    <Eye className="h-4 w-4" />
                    <span className="hidden sm:block">показать неполное</span>
                  </>
                ) : (
                  <>
                    <EyeOff className="h-4 w-4" />
                    <span className="hidden sm:block">скрыть неполное</span>
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
            Как долго происходит переселение c фактической даты старта
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
              data={
                data && onlyFull
                  ? data.map((entry) => ({
                      ...entry,
                      none: entry.full,
                    }))
                  : data
              }
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
                data:
                  data && onlyFull
                    ? data.map((entry) => ({
                        ...entry,
                        none: entry.full,
                      }))
                    : data || [],
                onClick: (data) => {
                  navigate({
                    to: './oldbuildings',
                    search: {
                      relocationAge: [data.age],
                    },
                  });
                },
              })}
              <ChartLegend content={<ChartLegendContent />} />
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { InProgressAgesChart };
