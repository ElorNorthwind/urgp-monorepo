import { useNavigate } from '@tanstack/react-router';
import {
  caseStatusStyles,
  useCases,
  viewStatusStyles,
} from '@urgp/client/entities';
import { SimpleBarChart } from '@urgp/client/features';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
  useAuth,
} from '@urgp/client/shared';
import {
  ApproveStatus,
  CaseFull,
  ControlToMeStatus,
  ViewStatus,
} from '@urgp/shared/entities';
import {
  ExternalLink,
  MessageSquareMore,
  MessageSquareQuote,
  MessageSquareReply,
  ServerCrash,
} from 'lucide-react';
import { useMemo } from 'react';

const countDispatchesToMeDone = (cases?: CaseFull[]) => {
  return (cases || [])
    .filter(
      (c) =>
        c?.hasControlToMe &&
        c?.approveStatus === ApproveStatus.approved &&
        c?.status?.category === 'рассмотрено',
    )
    .reduce(
      (prev, cur) => {
        // rejected
        if (cur?.status.id === 5)
          return {
            ...prev,
            rejected: prev.rejected + 1,
            total: prev.total + 1,
          };

        // done
        if (cur?.status.id === 6)
          return {
            ...prev,
            done: prev.done + 1,
            total: prev.total + 1,
          };

        // unsolved
        if (cur?.status.id === 6)
          return {
            ...prev,
            unsolved: prev.unsolved + 1,
            total: prev.total + 1,
          };

        //fallback
        return prev;
      },
      {
        rejected: 0,
        done: 0,
        unsolved: 0,
        total: 0,
      },
    );
};

type DispatchesToMeDoneChartProps = {
  className?: string;
};

const DispatchesToMeDoneChart = ({
  className,
}: DispatchesToMeDoneChartProps): JSX.Element => {
  const {
    data: cases,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    isError,
  } = useCases();
  const isLoading = isCasesLoading || isCasesFetching;

  const dispatchesToMeInfo = useMemo(() => {
    return countDispatchesToMeDone(cases);
  }, [cases]);

  const chartData = useMemo(() => {
    return [
      {
        key: 'done',
        label: 'Решено',
        value: dispatchesToMeInfo.done,
        icon: caseStatusStyles[6].icon,
      },
      {
        key: 'rejected',
        label: 'Отклонено',
        value: dispatchesToMeInfo.rejected,
        icon: caseStatusStyles[5].icon,
      },
      {
        key: 'unsolved',
        label: 'Нерешаемо',
        value: dispatchesToMeInfo.unsolved,
        icon: caseStatusStyles[7].icon,
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
      <CardHeader
        className={cn(
          'group/header z-10 cursor-pointer',
          'hover:from-muted hover:via-background/25 hover:to-background/0 hover:bg-gradient-to-br',
        )}
        onClick={() =>
          navigate({
            to: './cases',
            search: {
              control: [ControlToMeStatus.direct, ControlToMeStatus.deligated],
              status: [5, 6, 7],
            },
          })
        }
      >
        <CardTitle className="flex flex-row gap-2">
          <span>Отработано мною</span>
          <ExternalLink className="hidden size-6 flex-shrink-0 group-hover/header:block" />
        </CardTitle>
        <CardDescription>
          Закрытые дела с поручениями в мой адрес
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-end gap-4">
        <SimpleBarChart
          values={chartData}
          isLoading={isLoading}
          isError={isError}
          skeletonCount={3}
          // barClassName={cn('bg-indigo-300')}
          labelFit="full"
          className="z-10 max-w-full flex-grow"
          extraBarClass={(val) => {
            if (val.key === 'rejected') return 'bg-amber-300'; // 5
            if (val.key === 'done') return 'bg-emerald-300'; // 6
            if (val.key === 'unsolved') return 'bg-pink-300'; // 7
            return '';
          }}
          onBarClick={(key) => {
            const statusId =
              key === 'rejected' ? 5 : key === 'rejected' ? 7 : 6;
            navigate({
              to: './cases',
              search: {
                control: [
                  ControlToMeStatus.direct,
                  ControlToMeStatus.deligated,
                ],
                status: [statusId],
              },
            });
          }}
        />
        <div
          className={cn(
            'select-none text-8xl font-semibold text-gray-200',
            // '-mr-2 -mt-[100%] flex-shrink-0 ',
            'absolute right-3 top-0 z-0',
          )}
        >
          {isError ? (
            <ServerCrash className="m-3 size-16" />
          ) : isLoading ? (
            ''
          ) : (
            dispatchesToMeInfo.total
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { DispatchesToMeDoneChart };
