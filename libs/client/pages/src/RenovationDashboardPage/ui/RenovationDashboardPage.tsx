import { useNavigate } from '@tanstack/react-router';
import {
  DoneTimelineChart,
  OkrugTotalsChart,
  useDoneTimeline,
  useOkrugTotals,
  useTotalDeviations,
} from '@urgp/client/entities';
import { cn, Separator } from '@urgp/client/shared';
import { DashboardNumberCard } from '@urgp/client/widgets';
import {
  CircleAlert,
  CircleCheck,
  CircleEllipsis,
  CirclePause,
  CircleX,
} from 'lucide-react';

const RenovationDashboardPage = (): JSX.Element => {
  const {
    data: okrugs,
    isLoading: isOkrugsLoading,
    isFetching: isOkrugsFetching,
  } = useOkrugTotals();

  const {
    data: timeline,
    isLoading: isTimelineLoading,
    isFetching: isTimelineFetching,
  } = useDoneTimeline();

  const {
    data: deviations,
    isLoading: isDeviationsLoading,
    isFetching: isDeviationsFetching,
  } = useTotalDeviations();

  const navigate = useNavigate();

  return (
    <div className="block space-y-6 p-10">
      <div className="space-y-0.5">
        <h2 className="text-2xl font-bold tracking-tight">Дашборд</h2>
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
            description="домов"
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
            description="домов"
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
            description="домов"
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
            description="домов"
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
            description="домов"
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
          <OkrugTotalsChart
            okrugs={okrugs || []}
            isLoading={isOkrugsLoading || isOkrugsFetching}
            className="col-span-3 lg:col-span-5 xl:col-span-2"
          />
          <DoneTimelineChart
            timeline={timeline || []}
            isLoading={isTimelineLoading || isTimelineFetching}
            className="col-span-3 lg:col-span-5 xl:col-span-3"
          />
        </div>
      </div>
    </div>
  );
};
export { RenovationDashboardPage };
