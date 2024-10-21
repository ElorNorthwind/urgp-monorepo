import { rtkApi } from '@urgp/client/shared';
import {
  CityTotalAgeInfo,
  CityTotalDeviations,
  DoneByYearInfo,
  DoneTimelinePoint,
  MonthlyDoneInfo,
  MonthlyProgressInfo,
  OkrugTotalDeviations,
  OkrugTotals,
  OldBuildingsStartAndFinish,
  SankeyData,
  StartTimelineInfo,
} from '@urgp/shared/entities';

export const renovationStatisticsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getOkrugTotals: build.query<OkrugTotals[], void>({
      query: () => ({
        url: '/renovation/okrug-totals',
      }),
    }),
    getOkrugTotalDeviations: build.query<OkrugTotalDeviations[], void>({
      query: () => ({
        url: '/renovation/okrug-total-deviations',
      }),
    }),
    getDoneTimeline: build.query<DoneTimelinePoint[], void>({
      query: () => ({
        url: '/renovation/done-timeline',
      }),
    }),
    getTotalDeviations: build.query<CityTotalDeviations, void>({
      query: () => ({
        url: '/renovation/total-deviations',
        method: 'GET',
      }),
    }),
    getTotalAges: build.query<CityTotalAgeInfo[], void>({
      query: () => ({
        url: '/renovation/total-ages',
        method: 'GET',
      }),
    }),
    getDoneByYear: build.query<DoneByYearInfo[], void>({
      query: () => ({
        url: '/renovation/total-done-by-year',
        method: 'GET',
      }),
    }),
    getStartTimeline: build.query<StartTimelineInfo[], void>({
      query: () => ({
        url: '/renovation/start-timeline',
        method: 'GET',
      }),
    }),
    getLastUpdatedDate: build.query<Date, void>({
      query: () => ({
        url: '/renovation/last-updated-date',
        method: 'GET',
      }),
    }),
    getOldBuildingsStartAndFinishMonthly: build.query<
      OldBuildingsStartAndFinish[],
      void
    >({
      query: () => ({
        url: '/renovation/old-building/start-and-finish/monthly',
        method: 'GET',
      }),
    }),
    getOldBuildingsStartAndFinishYearly: build.query<
      OldBuildingsStartAndFinish[],
      void
    >({
      query: () => ({
        url: '/renovation/old-building/start-and-finish/yearly',
        method: 'GET',
      }),
    }),
    getMonthlyProgress: build.query<MonthlyProgressInfo[], void>({
      query: () => ({
        url: '/renovation/monthly-progress-timeline',
        method: 'GET',
      }),
    }),
    getMonthlyDone: build.query<MonthlyDoneInfo[], void>({
      query: () => ({
        url: '/renovation/monthly-done-timeline',
        method: 'GET',
      }),
    }),
    getCurrentYearSankey: build.query<SankeyData, void>({
      query: () => ({
        url: '/renovation/current-year-sankey',
        method: 'GET',
      }),
    }),
    // ToDo - вынеси в отдельный апи
    resetRenovationCache: build.mutation<void, void>({
      query: () => ({
        url: '/renovation/reset-cache',
        method: 'GET',
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetOkrugTotalsQuery: useOkrugTotals,
  useGetOkrugTotalDeviationsQuery: useOkrugTotalDeviations,
  useGetDoneTimelineQuery: useDoneTimeline,
  useGetTotalDeviationsQuery: useTotalDeviations,
  useGetTotalAgesQuery: useTotalAges,
  useGetDoneByYearQuery: useDoneByYear,
  useGetStartTimelineQuery: useStartTimeline,
  useGetLastUpdatedDateQuery: useLastUpdatedDate,
  useResetRenovationCacheMutation: useResetRenovationCache,
  useGetOldBuildingsStartAndFinishMonthlyQuery:
    useOldBuildingsStartAndFinishMonthly,
  useGetOldBuildingsStartAndFinishYearlyQuery:
    useOldBuildingsStartAndFinishYearly,
  useGetMonthlyProgressQuery: useMonthlyProgress,
  useGetMonthlyDoneQuery: useMonthlyDone,
  useGetCurrentYearSankeyQuery: useCurrentYearSankey,
} = renovationStatisticsApi;
