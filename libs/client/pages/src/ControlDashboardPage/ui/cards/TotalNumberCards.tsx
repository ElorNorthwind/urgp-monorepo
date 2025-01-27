import { useNavigate } from '@tanstack/react-router';
import { caseStatusStyles, useCases } from '@urgp/client/entities';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  cn,
  numericCases,
  Skeleton,
} from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';
import { isThisWeek } from 'date-fns';
import { CircleCheck, CirclePlay, CircleSlash, CircleX } from 'lucide-react';
import { useMemo } from 'react';

const countByStatus = (status: number[], cases?: Case[]) => {
  return {
    total: cases?.filter((c) => status.includes(c?.status?.id))?.length || 0,
    thisWeek:
      cases?.filter(
        (c) =>
          status.includes(c?.status?.id) &&
          isThisWeek(c.createdAt, { weekStartsOn: 1 }),
      )?.length || 0,
  };
};

const TotalNumberCards = (): JSX.Element => {
  const navigate = useNavigate({ from: '/control' });

  const {
    data: cases,
    isLoading: isCasesLoading,
    isFetching: isCasesFetching,
    isError: isCasesError,
  } = useCases();

  const isLoading = isCasesLoading || isCasesFetching;
  const isError = isCasesError;

  const commonIconStyle = cn(
    'size-44 flex-shrink-0 absolute right-[-2.5rem] bottom-[-2.5rem]',
  );
  const iconOpacityStyle = 'opacity-30';

  const totals = useMemo(() => {
    return [
      {
        key: 'inProgress',
        label: 'На рассмотрении',
        search: { status: [2, 3, 4] },
        ...countByStatus([2, 3, 4], cases),
        icon: (
          <CirclePlay
            className={cn(
              commonIconStyle,
              iconOpacityStyle,
              caseStatusStyles[2].iconStyle,
            )}
          />
        ),
        accentClassName: caseStatusStyles[2].iconStyle,
      },
      {
        key: 'rejected',
        label: 'Отклонено',
        search: { status: [5] },
        ...countByStatus([5], cases),
        icon: (
          <CircleSlash
            className={cn(
              commonIconStyle,
              iconOpacityStyle,
              caseStatusStyles[5].iconStyle,
            )}
          />
        ),
        accentClassName: caseStatusStyles[5].iconStyle,
      },
      {
        key: 'done',
        label: 'Решено',
        search: { status: [6] },
        ...countByStatus([6], cases),
        icon: (
          <CircleCheck
            className={cn(
              commonIconStyle,
              iconOpacityStyle,
              caseStatusStyles[6].iconStyle,
            )}
          />
        ),
        accentClassName: caseStatusStyles[6].iconStyle,
      },
      {
        key: 'unsolved',
        label: 'Не удалось решить',
        search: { status: [7] },
        ...countByStatus([7], cases),
        icon: (
          <CircleX
            className={cn(
              commonIconStyle,
              iconOpacityStyle,
              caseStatusStyles[7].iconStyle,
            )}
          />
        ),
        accentClassName: caseStatusStyles[7].iconStyle,
      },
    ];
  }, [cases, isLoading]);

  return (
    <div className="grid w-full grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-4">
      {totals.map((value) => {
        return (
          <Card
            key={value.key}
            className={cn(
              'relative overflow-hidden',
              'hover:from-muted hover:to-background/25 cursor-pointer hover:bg-gradient-to-tl',
            )}
            onClick={() =>
              navigate({
                to: './cases',
                search: value.search,
              })
            }
          >
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              {isLoading ? (
                <>
                  <Skeleton className="h-8 w-44" />
                  <Skeleton className={cn(commonIconStyle, 'rounded-full')} />
                </>
              ) : (
                <>
                  <CardTitle className="truncate leading-tight">
                    {value.label}
                  </CardTitle>
                  {value.icon}
                </>
              )}
            </CardHeader>
            <CardContent className="flex flex-col gap-2">
              <div className="flex flex-row items-center justify-start gap-2">
                {isLoading ? (
                  <>
                    <Skeleton className="h-10 w-10" />
                    <Skeleton className="h-6 w-12" />
                  </>
                ) : isError ? (
                  <p
                    className={cn(
                      'text-3xl font-bold',
                      'value.accentClassName',
                    )}
                  >
                    Ошибка загрузки
                  </p>
                ) : (
                  <>
                    <p
                      className={cn(
                        'text-5xl font-bold',
                        value.accentClassName,
                      )}
                    >
                      {value.total}
                    </p>
                    <p className="text-muted-foreground text-xl">
                      {numericCases(value.total)}
                    </p>
                  </>
                )}
              </div>
              {isLoading ? (
                <Skeleton className="h-4 w-32" />
              ) : (
                <div className="text-muted-foreground/80 text-sm">
                  {`+${value.thisWeek} ${numericCases(value.thisWeek)} за эту неделю`}
                </div>
              )}
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};
export { TotalNumberCards };
