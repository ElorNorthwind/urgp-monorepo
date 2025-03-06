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
import { ExternalLink, ServerCrash } from 'lucide-react';
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
  } = useCases();
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
        key: CaseActions.escalation,
        label: 'По заявкам запрошено мое решение',
        icon: pendingActionStyles[CaseActions.escalation]?.icon,
        value: countByPendingAction(CaseActions.escalation, cases),
        // style: 'bg-rose-200',
      },
      {
        key: CaseActions.controlToMe,
        label: 'Поступило ко мне на исполнение',
        icon: pendingActionStyles[CaseActions.controlToMe]?.icon,
        value: countByPendingAction(CaseActions.controlToMe, cases),
        // style: 'bg-rose-200',
      },
      {
        key: CaseActions.caseApprove,
        label: 'Проекты заявок ожидают моего утверждения',
        icon: pendingActionStyles[CaseActions.caseApprove]?.icon,
        value: countByPendingAction(CaseActions.caseApprove, filteredCases),
      },
      {
        key: CaseActions.operationApprove,
        label: 'Решения по заявкам ожидают моего утверждения',
        icon: pendingActionStyles[CaseActions.operationApprove]?.icon,
        value: countByPendingAction(
          CaseActions.operationApprove,
          filteredCases,
        ),
      },

      {
        key: CaseActions.reminderDone,
        label: 'Приняты решения по заявкам, за которыми я слежу',
        icon: pendingActionStyles[CaseActions.reminderDone]?.icon,
        value: countByPendingAction(CaseActions.reminderDone, cases),
        // style: 'bg-green-200',
      },
      {
        key: CaseActions.reminderOverdue,
        label: 'Истек срок напоминания по заявкам, за которыми я слежу',
        icon: pendingActionStyles[CaseActions.reminderOverdue]?.icon,
        value: countByPendingAction(CaseActions.reminderOverdue, cases),
        // style: 'bg-red-300',
      },

      {
        key: CaseActions.caseRejected,
        label: 'По моим заявкам отказали в согласовании',
        icon: pendingActionStyles[CaseActions.caseRejected]?.icon,
        value: countByPendingAction(CaseActions.caseRejected, filteredCases),
        // style: 'bg-yellow-200',
      },
      {
        key: CaseActions.caseProject,
        label: 'Я не направил проект дела на согласование',
        icon: pendingActionStyles[CaseActions.caseProject]?.icon,
        value: countByPendingAction(CaseActions.caseProject, filteredCases),
        // style: 'bg-yellow-200',
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
      <CardHeader
        className={cn(
          'group/header z-10 cursor-pointer',
          'hover:from-muted hover:via-background/25 hover:to-background/0 hover:bg-gradient-to-br',
        )}
        onClick={() => navigate({ to: './pending' })}
      >
        <CardTitle className="flex flex-row gap-2">
          <span>Ожидает моего решения</span>
          <ExternalLink className="hidden size-6 flex-shrink-0 group-hover/header:block" />
        </CardTitle>
        <CardDescription>
          Вопросы, которые мне требуется рассмотреть
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-end gap-4">
        <SimpleBarChart
          // values={chartData.sort((a, b) => b.value - a.value)}
          values={chartData}
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
