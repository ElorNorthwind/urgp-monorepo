import { useNavigate } from '@tanstack/react-router';
import { useAgeDifficulties } from '@urgp/client/entities';
import { SimpleBarChart } from '@urgp/client/features';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  Skeleton,
} from '@urgp/client/shared';
import { BrickWallFire, CalendarX, MailX, Scale } from 'lucide-react';
import { useMemo } from 'react';
import { Fragment } from 'react/jsx-runtime';

type AgeProblemsChartProps = {
  className?: string;
};

const AgeProblemsChartChart = ({
  className,
}: AgeProblemsChartProps): JSX.Element => {
  const { data, isLoading, isFetching, isError } = useAgeDifficulties();
  const navigate = useNavigate();

  const barStyles = {
    noNotification: {
      label: 'Не направлено ЗУ',
      filterValue: 'Нет ЗУ',
      style: 'bg-rose-200 group-hover:bg-rose-300',
      icon: MailX,
    },
    activeDefects: {
      label: 'Дефекты',
      filterValue: 'Неустраненные дефекты',
      style: 'bg-amber-200 group-hover:bg-amber-300',
      icon: BrickWallFire,
    },
    overdueLitigation: {
      label: 'Просрочен иск',
      filterValue: 'Просрочен иск',
      style: 'bg-teal-200 group-hover:bg-teal-300',
      icon: CalendarX,
    },
    longLitigation: {
      label: 'Долгий суд',
      filterValue: 'Долгие суды',
      style: 'bg-indigo-200 group-hover:bg-indigo-300',
      icon: Scale,
    },
  };

  const chartData = useMemo(() => {
    if (!data) return null;
    const result: Record<string, any> = {};
    const keys = Object.keys(barStyles);
    for (const age of data) {
      result[age.age] = [];
      for (const key of keys) {
        result[age.age].push({
          key: key,
          label: barStyles?.[key as keyof typeof barStyles]?.label,
          value: age[key as keyof typeof age],
          icon: barStyles?.[key as keyof typeof barStyles]?.icon,
        });
      }
    }
    return result;
  }, [data, isLoading]);

  return (
    <Card className={cn('relative', cn(className))}>
      <CardHeader className="space-y-0">
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
          <CardDescription className="h-4">
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
          <div className="flex flex-row gap-4">
            {data &&
              data.map((age) => {
                return (
                  <div
                    key={age?.age}
                    className="max-w-full flex-grow rounded border p-2"
                  >
                    <h3 className="bg-muted-foreground/10 -m-2 mb-2 py-1 text-center">
                      {age?.age}
                    </h3>
                    <SimpleBarChart
                      values={chartData?.[age?.age] || []}
                      isLoading={isLoading}
                      isError={isError}
                      skeletonCount={4}
                      extraBarClass={(val) => {
                        return barStyles?.[val?.key as keyof typeof barStyles]
                          ?.style;
                      }}
                      labelFit="full"
                      className="w-full max-w-full"
                      onBarClick={(key) => {
                        navigate({
                          to: './oldapartments',
                          search: {
                            relocationStatus: ['Переселение'],
                            relocationType: [1],
                            deviation: ['Требует внимания', 'Риск'],
                            relocationAge: [age.age],
                            problem: [
                              barStyles?.[key as keyof typeof barStyles]
                                ?.filterValue,
                            ],
                          },
                        });
                      }}
                    />
                  </div>
                );
              })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export { AgeProblemsChartChart };
