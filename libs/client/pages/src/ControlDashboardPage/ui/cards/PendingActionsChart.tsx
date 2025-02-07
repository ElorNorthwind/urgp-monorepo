import { useNavigate } from '@tanstack/react-router';
import { pendingActionStyles, useCases } from '@urgp/client/entities';
import { SimpleBarChart } from '@urgp/client/features';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@urgp/client/shared';
import { CaseActions, CaseFull } from '@urgp/shared/entities';
import { ServerCrash } from 'lucide-react';
import { forwardRef, useMemo } from 'react';

const countByPendingAction = (status: CaseActions, cases?: CaseFull[]) => {
  return cases?.filter((c) => c?.actions?.includes(status))?.length || 0;
};

type PendingActionChartProps = {
  className?: string;
};

const PendingActionChart = forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & PendingActionChartProps
>(({ className }: PendingActionChartProps, ref): JSX.Element => {
  const {
    data: cases,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    isError,
  } = useCases(undefined);
  const isLoading = isCasesLoading || isCasesFetching;
  const filteredCases = useMemo(
    () =>
      cases?.filter(
        (caseItem) => caseItem?.actions && caseItem?.actions.length > 0,
      ),
    [cases, isLoading],
  );

  const chartData = useMemo(() => {
    return [
      {
        key: 'case-approve',
        label: 'Проекты заявок ожидают моего утверждения',
        icon: pendingActionStyles['case-approve']?.icon,
        value:
          countByPendingAction('case-approve', filteredCases) +
          countByPendingAction('both-approve', filteredCases),
      },
      {
        key: 'operation-approve',
        label: 'Решения по заявкам ожидают моего утверждения',
        icon: pendingActionStyles['operation-approve']?.icon,
        value: countByPendingAction('operation-approve', filteredCases),
      },
      {
        key: 'case-rejected',
        label: 'По моим заявкам отказали в согласовании',
        icon: pendingActionStyles['case-rejected']?.icon,
        value: countByPendingAction('case-rejected', filteredCases),
        // style: 'bg-yellow-200',
      },
      {
        key: 'reminder-done',
        label: 'По заявкам, за которыми я слежу, приняты решения',
        icon: pendingActionStyles['reminder-done']?.icon,
        value: countByPendingAction('reminder-done', cases),
        // style: 'bg-green-200',
      },
      {
        key: 'reminder-overdue',
        label: 'Истек срок напоминания по заявкам за которыми я слежу',
        icon: pendingActionStyles['reminder-overdue']?.icon,
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
      ref={ref}
    >
      <CardHeader className="z-10">
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
});

export { PendingActionChart };
