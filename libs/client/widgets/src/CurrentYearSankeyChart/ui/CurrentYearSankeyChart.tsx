import { useCurrentYearSankey } from '@urgp/client/entities';
import {
  Button,
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
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { format } from 'date-fns';

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

  'Дольше 8 месяцев': {
    label: 'Дольше 8 месяцев',
    color: 'hsl(var(--chart-1))',
  },
  'От 5 до 8 месяцев': {
    label: 'От 5 до 8 месяцев',
    color: 'hsl(var(--chart-4))',
  },
  'Быстрее 5 месяцев': {
    label: 'Быстрее 5 месяцев',
    color: 'hsl(var(--chart-2))',
  },
  'Еще не завершено': {
    label: 'Остаются в работе',
    color: '#525252', // '#475569', // 'hsl(var(--chart-3))'
  },
} satisfies ChartConfig;

type CurrentYearSankeyChartProps = {
  className?: string;
};

const CurrentYearSankeyChart = ({
  className,
}: CurrentYearSankeyChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useCurrentYearSankey();
  const [onlyFull, setOnlyFull] = useState(false);

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
            <span>{`Структура отселений в ${format(new Date(), 'yyyy')} году`}</span>
            <Button
              variant={'ghost'}
              className="ml-auto h-6 py-0 px-1"
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
          <CardDescription className="">
            {
              'Когда было начато и сколько длилось переселение домов в теукщем году'
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
                data={
                  onlyFull
                    ? {
                        nodes: data.nodes,
                        links: data.links.map((link) => ({
                          ...link,
                          value: link.valueFull,
                        })),
                      }
                    : data
                }
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
              </Sankey>
            </ChartContainer>
          )
        )}
      </CardContent>
    </Card>
  );
};

export { CurrentYearSankeyChart };
