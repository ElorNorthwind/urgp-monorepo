import { useCurrentYearSankey } from '@urgp/client/entities';
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
import { Sankey } from 'recharts';
import { SankeyNode } from './SankeyNode';
import { SankeyLink } from './SankeyLink';

const CurrentYearSankeyChartConfig = {
  'Больше года тому назад': {
    label: 'Старт: больше года тому назад',
    color: '#9333ea', // 'hsl(var(--chart-3))'
  },
  'В прошлом году': {
    label: 'Старт: В прошлом году',
    color: '#4f46e5', // 'hsl(var(--chart-3))'
  },
  'В текущем году': {
    label: 'Старт: В текущем году',
    color: '#0284c7', // 'hsl(var(--chart-3))'
  },

  'Дольше года': {
    label: 'Дольше года',
    color: '#dc2626', // 'hsl(var(--chart-3))'
  },
  'От 8 до 12 месяцев': {
    label: 'От 8 до 12 месяцев',
    color: '#d97706', // 'hsl(var(--chart-3))'
  },
  'От 5 до 8 месяцев': {
    label: 'От 5 до 8 месяцев',
    color: '#65a30d', // 'hsl(var(--chart-3))'
  },
  'До 3 месяцев': {
    label: 'До 3 месяцев',
    color: '#34d399', // 'hsl(var(--chart-3))'
  },
} satisfies ChartConfig;

type CurrentYearSankeyChartProps = {
  className?: string;
};

const CurrentYearSankeyChart = ({
  className,
}: CurrentYearSankeyChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useCurrentYearSankey();

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
            <span>{'Структура завершенных в текущем году отселений'}</span>
          </CardTitle>
        )}
        {isLoading || isFetching ? (
          <Skeleton className="h-4 w-60" />
        ) : (
          <CardDescription className="">
            {
              'Когда было начато и сколько продолжалось переселение домов, завершенных в теукщем году'
            }
          </CardDescription>
        )}
      </CardHeader>
      <CardContent className="h-[480px]">
        {isLoading || isFetching ? (
          <div>
            <Skeleton className="mb-2 h-[calc(100%-2rem)] w-full" />
            <Skeleton className="mx-auto h-4 w-44" />
          </div>
        ) : (
          data && (
            <ChartContainer
              className="h-full w-full pt-0"
              config={CurrentYearSankeyChartConfig}
            >
              <Sankey
                // width={960}
                // width="100%"
                // height={400}
                margin={{ top: 20, bottom: 20, left: 6, right: 6 }}
                data={data}
                nodeWidth={10}
                nodePadding={40}
                linkCurvature={0.61}
                iterations={64}
                link={<SankeyLink config={CurrentYearSankeyChartConfig} />}
                node={
                  <SankeyNode
                    containerWidth={300}
                    config={CurrentYearSankeyChartConfig}
                  />
                }
                sort={false}
              >
                <ChartTooltip
                  cursor={false}
                  content={
                    <ChartTooltipContent
                      indicator="line"
                      className="w-[400px]"
                    />
                  }
                />
                {/* {renderRechartsTooltip({
                  config: CurrentYearSankeyChartConfig,
                  cursor: { fill: 'transparent' },
                })} */}
              </Sankey>
            </ChartContainer>
          )
        )}
      </CardContent>
    </Card>
  );
};

export { CurrentYearSankeyChart };
