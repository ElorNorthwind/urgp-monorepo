import { useNavigate } from '@tanstack/react-router';
import { useCases, viewStatusStyles } from '@urgp/client/entities';
import { SimpleBarChart } from '@urgp/client/features';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@urgp/client/shared';
import { CaseFull } from '@urgp/shared/entities';
import { ServerCrash } from 'lucide-react';
import { useMemo } from 'react';

const countByViewStatus = (status: string, cases?: Case[]) => {
  return cases?.filter((c) => c?.viewStatus === status)?.length || 0;
};

type ViewStatusChartProps = {
  className?: string;
};

const ViewStatusChart = ({ className }: ViewStatusChartProps): JSX.Element => {
  const {
    data: cases,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    isError,
  } = useCases();
  const isLoading = isCasesLoading || isCasesFetching;

  const chartData = useMemo(() => {
    return [
      {
        key: 'unchanged',
        label: 'Без изменений',
        value: countByViewStatus('unchanged', cases),
        icon: viewStatusStyles.unchanged.icon,
      },
      {
        key: 'new',
        label: 'Новое дело',
        value: countByViewStatus('new', cases),
        icon: viewStatusStyles.new.icon,
      },
      {
        key: 'changed',
        label: 'Есть изменения',
        value: countByViewStatus('changed', cases),
        icon: viewStatusStyles.changed.icon,
      },
    ];
  }, [cases, isLoading]);

  const navigate = useNavigate({ from: '/control' });

  return (
    <Card
      className={cn(
        'relative flex flex-col items-stretch justify-stretch overflow-hidden',
        className,
      )}
    >
      <CardHeader className="z-10">
        <CardTitle>Я отслеживаю</CardTitle>
        <CardDescription>Дела, на которые я подписан</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-end gap-4">
        <SimpleBarChart
          values={chartData}
          isLoading={isLoading}
          isError={isError}
          skeletonCount={3}
          barClassName={cn('bg-slate-300')}
          labelFit="full"
          className="z-10 max-w-full flex-grow"
          onBarClick={(key) =>
            navigate({
              to: './cases',
              search: { viewStatus: [key] },
            })
          }
        />
        <div
          className={cn(
            'select-none text-8xl font-semibold text-slate-200',
            // '-mr-2 -mt-[100%] flex-shrink-0 ',
            'absolute right-3 top-0 z-0',
          )}
        >
          {isError ? (
            <ServerCrash className="m-3 size-16" />
          ) : isLoading ? (
            ''
          ) : (
            chartData.reduce((acc, cur) => acc + cur.value, 0)
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { ViewStatusChart };
