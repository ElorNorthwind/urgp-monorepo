import { useNavigate } from '@tanstack/react-router';
import {
  equityObjectStatusStyles,
  equityObjectTypeStyles,
  useCases,
  useEquityTotals,
  viewStatusStyles,
} from '@urgp/client/entities';
import { SimpleBarChart } from '@urgp/client/features';
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
  Separator,
} from '@urgp/client/shared';
import { CaseFull, ViewStatus } from '@urgp/shared/entities';
import { ExternalLink, ServerCrash } from 'lucide-react';
import { useMemo } from 'react';
import { countByTypeAndStatuses } from '../../lib/countBy';
import { stat } from 'fs';
import { Label, PolarRadiusAxis, RadialBar, RadialBarChart } from 'recharts';
import { EquityTotalsGauge } from '../charts/EquityTotalsGauge';

// const countByViewStatus = (status: string, cases?: CaseFull[]) => {
//   return cases?.filter((c) => c?.viewStatus === status)?.length || 0;
// };

type CarSpotsTotalChartProps = {
  className?: string;
};

const CarSpotsTotalChart = ({
  className,
}: CarSpotsTotalChartProps): JSX.Element => {
  const {
    data,
    isLoading: isDataLoading,
    isFetching: isDataFetching,
    isError,
  } = useEquityTotals();
  const isLoading = isDataLoading || isDataFetching;
  const navigate = useNavigate({ from: '/equity' });
  const { icon: Icon } = equityObjectTypeStyles[2];
  return (
    <Card
      className={cn(
        'relative flex flex-col items-stretch justify-stretch overflow-hidden',
        className,
      )}
    >
      <CardHeader
        className={cn(
          'group/header z-10 flex cursor-pointer flex-row items-center gap-2',
          'hover:from-muted hover:via-background/25 hover:to-background/0 hover:bg-gradient-to-br',
        )}
        onClick={() =>
          navigate({
            to: './objects',
            search: {
              type: [2],
              // status: [1, 2, 3, 7],
            },
          })
        }
      >
        {Icon && <Icon className="size-12 flex-shrink-0" />}
        <div>
          <CardTitle className="flex flex-row gap-2">
            <span>Машиноместа</span>
            <ExternalLink className="hidden size-6 flex-shrink-0 group-hover/header:block" />
          </CardTitle>
          <CardDescription>Подземный паркинг</CardDescription>
        </div>
      </CardHeader>
      <CardContent className="flex flex-col items-end gap-2">
        <EquityTotalsGauge
          data={data}
          objectType={2}
          isLoading={isLoading}
          variant="top"
          action="give"
        />
        <Separator className="mx-auto h-[2px] w-[280px]" />
        <EquityTotalsGauge
          data={data}
          objectType={2}
          isLoading={isLoading}
          variant="bottom"
          action="take"
        />

        <div
          className={cn(
            'select-none text-5xl font-semibold text-violet-500/50',
            'absolute right-5 top-7 z-0',
          )}
        >
          {isError ? (
            <ServerCrash className="m-3 size-16" />
          ) : isLoading ? (
            '...'
          ) : (
            (data
              ? countByTypeAndStatuses(data, [1, 2, 3, 4, 5, 7, 8, 9, 10], 2)
              : 0
            ).toLocaleString('ru-RU')
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { CarSpotsTotalChart };
