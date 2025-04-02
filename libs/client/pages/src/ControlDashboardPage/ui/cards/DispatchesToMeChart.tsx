import { useNavigate } from '@tanstack/react-router';
import { useCases } from '@urgp/client/entities';
import { SimpleBarChart } from '@urgp/client/features';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  cn,
} from '@urgp/client/shared';
import {
  ApproveStatus,
  CaseFull,
  ControlToMeStatus,
} from '@urgp/shared/entities';
import {
  ExternalLink,
  MessageSquareMore,
  MessageSquareQuote,
  MessageSquareReply,
  ServerCrash,
} from 'lucide-react';
import { useMemo } from 'react';

const countDispatchesToMe = (cases?: CaseFull[]) => {
  return (cases || [])
    .filter(
      (c) =>
        c?.hasControlToMe &&
        (
          [
            ApproveStatus.approved,
            ApproveStatus.pending,
            ApproveStatus.project,
          ] as ApproveStatus[]
        ).includes(c?.approveStatus),
    )
    .reduce(
      (prev, cur) => {
        // // done
        // if (cur?.status?.category === 'рассмотрено')
        //   return {
        //     ...prev,
        //     done: prev.done + 1,
        //   };

        // awaiting
        if (cur?.status.id === 4)
          return {
            ...prev,
            awaiting: prev.awaiting + 1,
            total: prev.total + 1,
          };

        // deligated
        if (cur?.hasControlFromMe)
          return {
            ...prev,
            deligated: prev.deligated + 1,
            total: prev.total + 1,
          };

        // direct
        return { ...prev, direct: prev.direct + 1, total: prev.total + 1 };
      },
      {
        // done: 0,
        awaiting: 0,
        deligated: 0,
        direct: 0,
        total: 0,
      },
    );
};

type DispatchesToMeChartProps = {
  className?: string;
};

const DispatchesToMeChart = ({
  className,
}: DispatchesToMeChartProps): JSX.Element => {
  const {
    data: cases,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    isError,
  } = useCases();
  const isLoading = isCasesLoading || isCasesFetching;

  const dispatchesToMeInfo = useMemo(() => {
    return countDispatchesToMe(cases);
  }, [cases]);

  const chartData = useMemo(() => {
    return [
      {
        key: 'awaiting',
        label: 'Есть проект решения',
        value: dispatchesToMeInfo.awaiting,
        icon: MessageSquareQuote,
      },
      {
        key: 'deligated',
        label: 'Поручено мною сотруднику',
        value: dispatchesToMeInfo.deligated,
        icon: MessageSquareReply,
      },
      {
        key: 'direct',
        label: 'Остается у меня на рассмотрении',
        value: dispatchesToMeInfo.direct,
        icon: MessageSquareMore,
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
              status: [2, 3, 4, 8, 9, 11],
            },
          })
        }
      >
        <CardTitle className="flex flex-row gap-2">
          <span>У меня в работе</span>
          <ExternalLink className="hidden size-6 flex-shrink-0 group-hover/header:block" />
        </CardTitle>
        <CardDescription>
          Активные дела с поручениями в мой адрес
        </CardDescription>
      </CardHeader>
      <CardContent className="flex flex-row items-end gap-4">
        <SimpleBarChart
          values={chartData}
          isLoading={isLoading}
          isError={isError}
          skeletonCount={3}
          barClassName={cn('bg-indigo-300')}
          labelFit="full"
          className="z-10 max-w-full flex-grow"
          onBarClick={(key) => {
            if (key === 'awaiting') {
              navigate({
                to: './cases',
                search: {
                  control: [
                    ControlToMeStatus.direct,
                    ControlToMeStatus.deligated,
                  ],
                  status: [4],
                },
              });
            }

            if (key === 'direct') {
              navigate({
                to: './cases',
                search: {
                  control: [ControlToMeStatus.direct],
                  status: [2, 3, 8, 9, 11],
                },
              });
            }

            if (key === 'deligated') {
              navigate({
                to: './cases',
                search: {
                  control: [ControlToMeStatus.deligated],
                  status: [2, 3, 8, 9, 11],
                },
              });
            }
          }}
        />
        <div
          className={cn(
            'select-none text-8xl font-semibold text-indigo-200',
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

export { DispatchesToMeChart };
