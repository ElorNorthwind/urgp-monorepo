import { useNavigate } from '@tanstack/react-router';
import { useLastUpdatedDate, useTotalDeviations } from '@urgp/client/entities';
import { DashboardNumberCard } from '@urgp/client/features';
import { cn, Separator } from '@urgp/client/shared';
import { DoneTimelineChart, OkrugTotalsChart } from '@urgp/client/widgets';
import { formatDate } from 'date-fns';
import {
  CircleAlert,
  CircleCheck,
  CircleEllipsis,
  CirclePause,
  CircleX,
} from 'lucide-react';
import { useCallback } from 'react';

const RenovationDashboardPage = (): JSX.Element => {
  const {
    data: deviations,
    isLoading: isDeviationsLoading,
    isFetching: isDeviationsFetching,
  } = useTotalDeviations();

  const {
    data: updatedDate,
    // isLoading: isUpdatedDateLoading,
    // isFetching: isUpdatedDateFetching,
  } = useLastUpdatedDate();

  const navigate = useNavigate();

  const numericHouses = useCallback((value: number) => {
    const lastLetter = value.toString().slice(-1);
    if (lastLetter === '1') {
      return `дом`;
    } else if (['2', '3', '4'].includes(lastLetter)) {
      return `дома`;
    } else {
      return `домов`;
    }
  }, []);

  return (
    <div className="block space-y-6 p-10">
      <div className="space-y-0.5">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold tracking-tight">Дашборд</h2>
          <p className="text-muted-foreground text-right text-xs">
            <span className="hidden md:block">Данные на</span>
            {formatDate(updatedDate || new Date(), 'dd.MM.yyyy')}
          </p>
        </div>
        <p className="text-muted-foreground">
          Общие сведения о ходе выполнения программы Реновации
        </p>
      </div>
      <Separator className="my-6" />
      <div className="flex flex-col space-y-8 lg:flex-row lg:space-x-12 lg:space-y-0">
        <div className="grid w-full grid-cols-3 gap-6 lg:grid-cols-5">
          <DashboardNumberCard
            label="Работа завершена"
            value={deviations?.done || 0}
            Icon={CircleCheck}
            description={numericHouses(deviations?.done || 0)}
            accentClassName={cn('text-emerald-600')}
            className={'col-span-3 sm:col-span-2 lg:col-span-1'}
            isLoading={isDeviationsLoading || isDeviationsFetching}
            onClick={() =>
              navigate({
                to: './oldbuildings',
                search: { relocationStatus: ['Завершено'] },
              })
            }
          />
          <DashboardNumberCard
            label="В работе по плану"
            value={deviations?.none || 0}
            Icon={CircleEllipsis}
            description={numericHouses(deviations?.none || 0)}
            accentClassName={cn('text-cyan-600')}
            isLoading={isDeviationsLoading || isDeviationsFetching}
            className={'col-span-3 sm:col-span-1'}
            onClick={() =>
              navigate({
                to: './oldbuildings',
                search: {
                  relocationStatus: ['Снос', 'Отселение', 'Переселение'],
                  deviation: ['Без отклонений'],
                },
              })
            }
          />
          <DashboardNumberCard
            label="Требуют внимания"
            value={deviations?.warning || 0}
            Icon={CircleAlert}
            description={numericHouses(deviations?.warning || 0)}
            accentClassName={cn('text-amber-600')}
            isLoading={isDeviationsLoading || isDeviationsFetching}
            className={'col-span-3 sm:col-span-1'}
            onClick={() =>
              navigate({
                to: './oldbuildings',
                search: {
                  relocationStatus: ['Снос', 'Отселение', 'Переселение'],
                  deviation: ['Требует внимания'],
                },
              })
            }
          />
          <DashboardNumberCard
            label="Имеются риски"
            value={deviations?.risk || 0}
            Icon={CircleX}
            description={numericHouses(deviations?.risk || 0)}
            accentClassName={cn('text-rose-600')}
            isLoading={isDeviationsLoading || isDeviationsFetching}
            className={'col-span-3 sm:col-span-1'}
            onClick={() =>
              navigate({
                to: './oldbuildings',
                search: {
                  relocationStatus: ['Снос', 'Отселение', 'Переселение'],
                  deviation: ['Наступили риски'],
                },
              })
            }
          />
          <DashboardNumberCard
            label="Переселение не начато"
            value={deviations?.notStarted || 0}
            Icon={CirclePause}
            description={numericHouses(deviations?.notStarted || 0)}
            accentClassName={cn('text-neutral-500')}
            isLoading={isDeviationsLoading || isDeviationsFetching}
            className={'col-span-3 sm:col-span-1'}
            onClick={() =>
              navigate({
                to: './oldbuildings',
                search: {
                  relocationStatus: ['Не начато'],
                },
              })
            }
          />
          <OkrugTotalsChart className="col-span-3 lg:col-span-5 xl:col-span-2" />
          <DoneTimelineChart className="col-span-3 lg:col-span-5 xl:col-span-3" />
        </div>
      </div>
    </div>
  );
};
export { RenovationDashboardPage };
