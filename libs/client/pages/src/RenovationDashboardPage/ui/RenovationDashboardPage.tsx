import { getRouteApi, useNavigate } from '@tanstack/react-router';
import {
  useLastUpdatedDate,
  useNewBuildingsDeviationTotals,
  useNewBuildingsStatusTotals,
  useTotalDeviations,
} from '@urgp/client/entities';
import { DashboardNumberCard, ResetCacheButton } from '@urgp/client/features';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
  cn,
  selectCurrentUser,
  Separator,
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@urgp/client/shared';
import {
  AgeProblemsChartChart,
  CurrentYearApartmentsSankeyChart,
  CurrentYearSankeyChart,
  DoneByYearChart,
  InProgressAgesChart,
  MonthlyDoneTimelineChart,
  MonthlyProgressTimelineChart,
  OkrugTotalDeviationsChart,
  OkrugTotalsChart,
  PlotInProgressDeviationAgesChart,
  RenovationDefectsFileUploadForm,
  StartAndFinishTimelineChart,
  StartTimelineChart,
} from '@urgp/client/widgets';
import { formatDate } from 'date-fns';
import { de } from 'date-fns/locale';
import {
  AreaChart,
  CircleAlert,
  CircleCheck,
  CircleEllipsis,
  CirclePause,
  CircleX,
} from 'lucide-react';
import { useCallback } from 'react';
import { useSelector } from 'react-redux';

const RenovationDashboardPage = (): JSX.Element => {
  const user = useSelector(selectCurrentUser);

  const { tab } = getRouteApi('/renovation').useSearch();

  const {
    data: deviations,
    isLoading: isDeviationsLoading,
    isFetching: isDeviationsFetching,
  } = useTotalDeviations();

  const {
    data: newBuildingsStatus,
    isLoading: isNewBuildingsStatusLoading,
    isFetching: isNewBuildingsStatusFetching,
  } = useNewBuildingsStatusTotals();

  const { data: updatedDate } = useLastUpdatedDate();

  const navigate = useNavigate({ from: '/renovation' });

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

  const numericPlots = useCallback((value: number) => {
    const lastLetter = value.toString().slice(-1);
    if (lastLetter === '1') {
      return `площадка`;
    } else if (['2', '3', '4'].includes(lastLetter)) {
      return `площадки`;
    } else {
      return `площадок`;
    }
  }, []);

  return (
    <Tabs
      asChild
      defaultValue="old"
      value={tab ?? 'old'}
      onValueChange={(value) => {
        navigate({
          search: { tab: value === 'old' ? undefined : value },
        });
      }}
    >
      <div className="block space-y-6 p-10">
        <div className="space-y-0.5">
          <div className="flex items-center justify-between gap-2">
            <h2 className="text-2xl font-bold tracking-tight">Дашборд</h2>
            <TabsList className={cn('ml-auto grid grid-flow-col')}>
              <TabsTrigger value="old">Данные по сносимым домам</TabsTrigger>
              <TabsTrigger value="new">
                Данные по освобождаемым участкам
              </TabsTrigger>
            </TabsList>
            <ResetCacheButton className="" />
            <p className="text-muted-foreground text-right text-xs">
              <span className="hidden md:block">Данные на</span>
              {updatedDate ? formatDate(updatedDate, 'dd.MM.yyyy') : '...'}
            </p>
          </div>
          <p className="text-muted-foreground">
            Общие сведения о ходе выполнения программы Реновации
          </p>
        </div>
        <Separator className="my-6" />
        <div className="flex flex-col space-y-8 md:flex-row md:space-x-12 md:space-y-0">
          <div className="grid w-full grid-cols-3 gap-6 md:grid-cols-5">
            <TabsContent value="old" asChild>
              <>
                <DashboardNumberCard
                  label="Работа завершена"
                  value={deviations?.done || 0}
                  Icon={CircleCheck}
                  description={numericHouses(deviations?.done || 0)}
                  accentClassName={cn('text-emerald-600')}
                  className={'col-span-3 sm:col-span-2 md:col-span-1'}
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
                  value={
                    (deviations?.warning || 0) + (deviations?.warningMoved || 0)
                  }
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
                  value={(deviations?.risk || 0) + (deviations?.riskMoved || 0)}
                  Icon={CircleX}
                  description={numericHouses(deviations?.risk || 0)}
                  accentClassName={cn('text-rose-600')}
                  isLoading={isDeviationsLoading || isDeviationsFetching}
                  className={'col-span-3 sm:col-span-1'}
                  secondaryDescription={
                    deviations?.riskMoved && deviations?.riskMoved > 0
                      ? `из них ${deviations?.riskMoved} - перешли из частичного`
                      : ''
                  }
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
                <OkrugTotalsChart className="col-span-3 md:col-span-5 xl:col-span-3" />
                <OkrugTotalDeviationsChart className="col-span-3 md:col-span-5 xl:col-span-2" />

                <StartAndFinishTimelineChart className="col-span-3 md:col-span-5 xl:col-span-2" />
                <InProgressAgesChart className="col-span-3 md:col-span-5 xl:col-span-3" />
              </>
            </TabsContent>

            <TabsContent value="new" asChild>
              <>
                <DashboardNumberCard
                  label="Освобождено"
                  value={newBuildingsStatus?.done || 0}
                  Icon={CircleCheck}
                  description={numericPlots(newBuildingsStatus?.done || 0)}
                  accentClassName={cn('text-emerald-600')}
                  isLoading={
                    isNewBuildingsStatusLoading || isNewBuildingsStatusFetching
                  }
                  className={'col-span-3 sm:col-span-1'}
                  // onClick={() =>
                  //   navigate({
                  //     to: './oldbuildings',
                  //     search: {
                  //       relocationStatus: ['Снос', 'Отселение', 'Переселение'],
                  //       deviation: ['Требует внимания'],
                  //     },
                  //   })
                  // }
                />
                <DashboardNumberCard
                  label="Идет частичное освобождение"
                  value={newBuildingsStatus?.partial || 0}
                  Icon={CircleAlert}
                  description={numericPlots(newBuildingsStatus?.partial || 0)}
                  accentClassName={cn('text-amber-600')}
                  isLoading={
                    isNewBuildingsStatusLoading || isNewBuildingsStatusFetching
                  }
                  className={'col-span-3 sm:col-span-1'}
                  // onClick={() =>
                  //   navigate({
                  //     to: './oldbuildings',
                  //     search: {
                  //       relocationStatus: ['Снос', 'Отселение', 'Переселение'],
                  //       deviation: ['Требует внимания'],
                  //     },
                  //   })
                  // }
                />
                <DashboardNumberCard
                  label="Полное освобождение идет по плану"
                  value={newBuildingsStatus?.ok || 0}
                  Icon={CircleEllipsis}
                  description={numericPlots(newBuildingsStatus?.ok || 0)}
                  accentClassName={cn('text-cyan-600')}
                  isLoading={
                    isNewBuildingsStatusLoading || isNewBuildingsStatusFetching
                  }
                  className={'col-span-3 sm:col-span-1'}
                  // onClick={() =>
                  //   navigate({
                  //     to: './oldbuildings',
                  //     search: {
                  //       relocationStatus: ['Снос', 'Отселение', 'Переселение'],
                  //       deviation: ['Требует внимания'],
                  //     },
                  //   })
                  // }
                />
                <DashboardNumberCard
                  label="Полное освобождение имеет риски"
                  value={newBuildingsStatus?.risk || 0}
                  Icon={CircleX}
                  description={numericPlots(newBuildingsStatus?.risk || 0)}
                  accentClassName={cn('text-rose-600')}
                  isLoading={
                    isNewBuildingsStatusLoading || isNewBuildingsStatusFetching
                  }
                  className={'col-span-3 sm:col-span-1'}
                  // onClick={() =>
                  //   navigate({
                  //     to: './oldbuildings',
                  //     search: {
                  //       relocationStatus: ['Снос', 'Отселение', 'Переселение'],
                  //       deviation: ['Требует внимания'],
                  //     },
                  //   })
                  // }
                />
                <DashboardNumberCard
                  label="Освобождение еще не начато"
                  value={newBuildingsStatus?.none || 0}
                  Icon={CirclePause}
                  description={numericPlots(newBuildingsStatus?.none || 0)}
                  accentClassName={cn('text-neutral-500')}
                  isLoading={
                    isNewBuildingsStatusLoading || isNewBuildingsStatusFetching
                  }
                  className={'col-span-3 sm:col-span-1'}
                  // onClick={() =>
                  //   navigate({
                  //     to: './oldbuildings',
                  //     search: {
                  //       relocationStatus: ['Снос', 'Отселение', 'Переселение'],
                  //       deviation: ['Требует внимания'],
                  //     },
                  //   })
                  // }
                />
                <PlotInProgressDeviationAgesChart className="col-span-full" />
              </>
            </TabsContent>

            <AgeProblemsChartChart className="col-span-5" />

            <StartTimelineChart className="col-span-full" />

            {user && user.id !== 0 && (
              <Accordion type="multiple" className="col-span-full">
                <AccordionItem value="extra-charts">
                  <AccordionTrigger className="text-2xl font-bold tracking-tight hover:no-underline">
                    <div className="flex items-start gap-2">
                      <AreaChart className="ml-2 size-8 flex-shrink-0" />
                      <span>Дополнительные графики</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="grid w-full grid-cols-3 gap-6 md:grid-cols-5">
                    {/* <DoneByYearChart className="col-span-full" /> */}

                    {user &&
                      (user.roles.includes('admin') ||
                        user.roles.includes('editor') ||
                        user.roles.includes('boss')) && (
                        <>
                          <MonthlyProgressTimelineChart className="col-span-3 md:col-span-5 xl:col-span-5" />
                          <MonthlyDoneTimelineChart className="col-span-3 md:col-span-5 xl:col-span-5" />
                          {/* <CurrentYearSankeyChart className="col-span-3 md:col-span-5 xl:col-span-5" /> */}
                          {/* <CurrentYearApartmentsSankeyChart className="col-span-3 md:col-span-5 xl:col-span-3" /> */}
                        </>
                      )}
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}
          </div>
        </div>
        {user &&
          (user.roles.includes('admin') || user.roles.includes('editor')) && (
            <RenovationDefectsFileUploadForm />
          )}
      </div>
    </Tabs>
  );
};
export default RenovationDashboardPage;
