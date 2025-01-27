import { useNavigate } from '@tanstack/react-router';
import { usePendingCases } from '@urgp/client/entities';
import { SimpleBarChart } from '@urgp/client/features';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@urgp/client/shared';
import { CaseWithPendingInfo } from '@urgp/shared/entities';
import { ServerCrash } from 'lucide-react';
import { useMemo } from 'react';

const countByPendingAction = (
  status: string,
  cases?: CaseWithPendingInfo[],
) => {
  return cases?.filter((c) => c?.action === status)?.length || 0;
};

type PendingActionChartProps = {
  className?: string;
};

const PendingActionChart = ({
  className,
}: PendingActionChartProps): JSX.Element => {
  const {
    data: cases,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    isError,
  } = usePendingCases();
  const isLoading = isCasesLoading || isCasesFetching;

  const chartData = useMemo(() => {
    return [
      {
        key: 'case-approve',
        label: 'Проекты заявок ожидают моего утверждения',
        value:
          countByPendingAction('case-approve', cases) +
          countByPendingAction('both-approve', cases),
      },
      {
        key: 'operation-approve',
        label: 'Решения по заявкам ожидают моего утверждения',
        value: countByPendingAction('operation-approve', cases),
      },
      {
        key: 'case-rejected',
        label: 'По моим заявкам отказали в согласовании',
        value: countByPendingAction('case-rejected', cases),
        // style: 'bg-yellow-200',
      },
      {
        key: 'reminder-done',
        label: 'По заявкам, за которыми я слежу, приняты решения',
        value: countByPendingAction('reminder-done', cases),
        // style: 'bg-green-200',
      },
      {
        key: 'reminder-overdue',
        label: 'Истек срок напоминания по заявкам за которыми я слежу',
        value: countByPendingAction('reminder-overdue', cases),
        // style: 'bg-rose-200',
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
      <CardHeader className="">
        <CardTitle>Ожидает моего решения</CardTitle>
        <CardDescription>
          Вопросы, которые мне требуется рассмотреть
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-end gap-4">
        <SimpleBarChart
          values={chartData.sort((a, b) => b.value - a.value)}
          isLoading={isLoading}
          isError={isError}
          skeletonCount={3}
          barClassName={cn('bg-stone-300')}
          labelFit="full"
          className="z-10 max-w-full flex-grow"
          onBarClick={(key) =>
            navigate({
              to: './pending',
              search: { action: [key] },
            })
          }
        />
        <div
          className={cn(
            'select-none text-8xl font-semibold text-stone-200',
            // '-mr-2 -mt-[100%] flex-shrink-0 ',
            'absolute right-2 top-0 z-0',
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

export { PendingActionChart };
