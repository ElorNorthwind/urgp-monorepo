import { useNavigate } from '@tanstack/react-router';
import { useAgeDifficulties, useTotalAges } from '@urgp/client/entities';
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
import { useState } from 'react';
import { BarChart, XAxis, YAxis } from 'recharts';

const inProgressAgeChartConfig = {
  noNotification: {
    label: 'Не направлено ЗУ',
    color: 'hsl(var(--chart-1))', // '#f43f5e',
  },
  activeDefects: {
    label: 'Дефекты',
    color: 'hsl(var(--chart-4))', // '#f59e0b',
  },
  overdueLitigation: {
    label: 'Просрочен иск',
    color: 'hsl(var(--chart-3))', // '#06b6d4',
  },
  longLitigation: {
    label: 'Суды дольше 3 мес.',
    color: 'hsl(var(--chart-2))', // '#06b6d4',
  },
} satisfies ChartConfig;

type AgeProblemsChartProps = {
  className?: string;
};

const AgeProblemsChartChart = ({
  className,
}: AgeProblemsChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useAgeDifficulties();
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
            <span>Отклонения в проблемных домах</span>
          </CardTitle>
        )}
        {isLoading || isFetching ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="h-16">
            Трудности в работе с проблемными семьями
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
              data={data || []}
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
                onClick: (data) => {
                  navigate({
                    to: './oldbuildings',
                    search: {
                      relocationAge: [data.age],
                      deviation: 'Наступили риски',
                    },
                  });
                },
              })}
              {/* <ChartLegend content={<ChartLegendContent />} /> */}
            </BarChart>
          </ChartContainer>
        )}
      </CardContent>
    </Card>
  );
};

export { AgeProblemsChartChart };
