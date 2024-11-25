import {
  useCurrentYearApartmentsSankey,
  useCurrentYearSankey,
} from '@urgp/client/entities';
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

// ('Закрепление', 0),
// ('Федералка', 1),
// ('Обычное переселение', 2 ),
// ('Иск градан', 3),
// ('Иск ДГИ', 4),
// ('МФР', 5),
// ('В работе', 6),
// ('Освобождено без переселения', 7),
// ('Переселён', 8),
// ('Дольше 8 месяцев', 9),
// ('От 5 до 8 месяцев', 10),
// ('Быстрее 5 месяцев', 11)

const CurrentYearApartmentsSankeyChartConfig = {
  Закрепление: {
    label: 'Закрепление',
    color: 'hsl(var(--chart-3))',
  },
  Федералка: {
    label: 'Закрепление',
    color: 'hsl(var(--chart-3))',
  },
  'Обычное переселение': {
    label: 'Обычное переселение',
    color: 'hsl(var(--chart-3))',
  },
  'Иск граждан': {
    label: 'Иск граждан',
    color: 'hsl(var(--chart-3))',
  },
  'Иск ДГИ': {
    label: 'Иск ДГИ',
    color: 'hsl(var(--chart-3))',
  },
  МФР: {
    label: 'МФР',
    color: 'hsl(var(--chart-3))',
  },
  Отказ: {
    label: 'Отказ',
    color: 'hsl(var(--chart-3))',
  },
  'В работе': {
    label: 'В работе',
    color: 'hsl(var(--chart-3))',
  },
  'Освобождено без переселения': {
    label: 'Освобождено без переселения',
    color: 'hsl(var(--chart-3))',
  },
  Переселён: {
    label: 'Переселён',
    color: 'hsl(var(--chart-3))',
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
} satisfies ChartConfig;

type CurrentYearApartmentsSankeyChartProps = {
  className?: string;
};

const CurrentYearApartmentsSankeyChart = ({
  className,
}: CurrentYearApartmentsSankeyChartProps): JSX.Element => {
  const { data, isLoading, isFetching } = useCurrentYearApartmentsSankey();
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
              config={CurrentYearApartmentsSankeyChartConfig}
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
                link={
                  <SankeyLink config={CurrentYearApartmentsSankeyChartConfig} />
                }
                node={
                  <SankeyNode
                    containerWidth={300}
                    config={CurrentYearApartmentsSankeyChartConfig}
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

export { CurrentYearApartmentsSankeyChart };
