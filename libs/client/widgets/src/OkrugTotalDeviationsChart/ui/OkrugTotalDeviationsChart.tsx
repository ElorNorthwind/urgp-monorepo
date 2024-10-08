import { useNavigate } from '@tanstack/react-router';
import { useOkrugTotalDeviations } from '@urgp/client/entities';
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
import { House, Users } from 'lucide-react';
import { useState } from 'react';
import { BarChart, CartesianGrid, XAxis } from 'recharts';

const okrugTotalDeviationsChartConfig = {
  riskHouses: {
    label: 'Наступили риски',
    color: 'hsl(var(--chart-1))',
  },
  attentionHouses: {
    label: 'Требует внимания',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

const okrugTotalDeviationsApartmentChartConfig = {
  riskApartments: {
    label: 'Наступили риски',
    color: 'hsl(var(--chart-1))',
  },
  attentionApartments: {
    label: 'Требует внимания',
    color: 'hsl(var(--chart-4))',
  },
} satisfies ChartConfig;

type OkrugTotalDeviationsChartProps = {
  className?: string;
};

const OkrugTotalDeviationsChart = ({
  className,
}: OkrugTotalDeviationsChartProps): JSX.Element => {
  const { data: okrugs, isLoading, isFetching } = useOkrugTotalDeviations();
  const navigate = useNavigate();
  const [showApartments, setShowApartments] = useState(false);

  return (
    <Card className={cn(className)}>
      <CardHeader className="space-y-0 pb-2">
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-1 h-6 w-32" />
            <Skeleton className="mb-1 h-4 w-44" />
          </div>
        ) : (
          <CardTitle className="flex flex-row items-center justify-between">
            <span>Проблемы по округам</span>
            <Button
              variant={'ghost'}
              className="h-6 py-0 px-1"
              onClick={() => setShowApartments((value) => !value)}
            >
              <span
                className="flex flex-row items-center gap-1"
                style={{ color: 'hsl(var(--chart-1))' }}
              >
                {showApartments ? (
                  <>
                    <House className="h-4 w-4" />
                    <span className="hidden sm:block">показать дома</span>
                  </>
                ) : (
                  <>
                    <Users className="h-4 w-4" />
                    <span className="hidden sm:block">показать семьи</span>
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
            {showApartments
              ? 'Семьи, по которым нарушены ожидаемые сроки'
              : 'Дома, в которых имеются проблемные семьи'}
          </CardDescription>
        )}
      </CardHeader>
      <CardContent>
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-2 h-[280px] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          <ChartContainer
            config={
              showApartments
                ? okrugTotalDeviationsApartmentChartConfig
                : okrugTotalDeviationsChartConfig
            }
            className="mt-[-35px] h-full w-full lg:h-[320px]"
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
              {renderRechartsTooltip({
                config: showApartments
                  ? okrugTotalDeviationsApartmentChartConfig
                  : okrugTotalDeviationsChartConfig,
                cursor: true,
              })}
              <ChartLegend content={<ChartLegendContent />} />

              {renderRechartsStackedBar({
                config: showApartments
                  ? okrugTotalDeviationsApartmentChartConfig
                  : okrugTotalDeviationsChartConfig,
                data: okrugs,
                orientation: 'vertical',
                onClick: (data) => {
                  // console.log(JSON.stringify(data, null, 2));
                  navigate({
                    to: './oldbuildings',
                    search: {
                      okrugs: [data.okrug],
                      deviation: ['Требует внимания', 'Наступили риски'],
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

export { OkrugTotalDeviationsChart };
