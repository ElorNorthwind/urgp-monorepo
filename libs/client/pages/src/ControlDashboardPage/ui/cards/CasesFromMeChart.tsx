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
  useAuth,
} from '@urgp/client/shared';
import { ApproveStatus, CaseFull, ViewStatus } from '@urgp/shared/entities';
import {
  CircleCheck,
  CircleEllipsis,
  CirclePlay,
  ExternalLink,
  MessageSquareMore,
  MessageSquareQuote,
  MessageSquareReply,
  ServerCrash,
} from 'lucide-react';
import { useMemo } from 'react';

const countCasesFromMe = (cases?: CaseFull[], userId?: number) => {
  return (cases || [])
    .filter(
      (c) =>
        c?.author?.id === userId ||
        (c?.approveFrom?.id === userId &&
          c?.approveStatus === ApproveStatus.approved),
    )
    .reduce(
      (prev, cur) => {
        // done
        if (cur?.status?.category === 'рассмотрено')
          return {
            ...prev,
            done: prev.done + 1,
            total: prev.total + 1,
          };

        // project
        if (cur?.status?.category === 'проект')
          return {
            ...prev,
            project: prev.project + 1,
            total: prev.total + 1,
          };

        // active
        return { ...prev, active: prev.active + 1, total: prev.total + 1 };
      },
      {
        done: 0,
        active: 0,
        project: 0,
        total: 0,
      },
    );
};

type CasesFromMeChartProps = {
  className?: string;
};

const CasesFromMeChart = ({
  className,
}: CasesFromMeChartProps): JSX.Element => {
  const {
    data: cases,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    isError,
  } = useCases();
  const isLoading = isCasesLoading || isCasesFetching;
  const user = useAuth();

  const dispatchesToMeInfo = useMemo(() => {
    return countCasesFromMe(cases, user?.id || 0);
  }, [cases, user]);

  const chartData = useMemo(() => {
    return [
      {
        key: 'done',
        label: 'Рассмотрены',
        value: dispatchesToMeInfo.done,
        icon: CircleCheck,
      },
      {
        key: 'active',
        label: 'В работе',
        value: dispatchesToMeInfo.active,
        icon: CirclePlay,
      },
      {
        key: 'project',
        label: 'В проекте',
        value: dispatchesToMeInfo.project,
        icon: CircleEllipsis,
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
              fromMe: true,
            },
          })
        }
      >
        <CardTitle className="flex flex-row gap-2">
          <span>Направлено от меня</span>
          <ExternalLink className="hidden size-6 flex-shrink-0 group-hover/header:block" />
        </CardTitle>
        <CardDescription>Дела, созданные или одобренные мной</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-end gap-4">
        <SimpleBarChart
          values={chartData}
          isLoading={isLoading}
          isError={isError}
          skeletonCount={3}
          barClassName={cn('bg-orange-300')}
          labelFit="full"
          className="z-10 max-w-full flex-grow"
          onBarClick={(key) => {
            const statuses =
              key === 'done'
                ? [5, 6, 7]
                : key === 'project'
                  ? [1, 10, 12]
                  : [2, 3, 4, 8, 9, 11];
            navigate({
              to: './cases',
              search: {
                fromMe: true,
                status: statuses,
              },
            });
          }}
        />
        <div
          className={cn(
            'select-none text-8xl font-semibold text-orange-200',
            // '-mr-2 -mt-[100%] flex-shrink-0 ',
            'absolute right-3 top-0 z-0',
          )}
        >
          {isError ? (
            <ServerCrash className="m-3 size-16" />
          ) : isLoading ? (
            ''
          ) : (
            dispatchesToMeInfo.active
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export { CasesFromMeChart };
