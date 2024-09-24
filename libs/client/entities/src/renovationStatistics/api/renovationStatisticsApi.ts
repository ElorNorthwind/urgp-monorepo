import { rtkApi } from '@urgp/client/shared';
import {
  CityTotalAgeInfo,
  CityTotalDeviations,
  DoneByYearInfo,
  DoneTimelinePoint,
  OkrugTotals,
  StartTimelineInfo,
} from '@urgp/shared/entities';

export const renovationStatisticsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getOkrugTotals: build.query<OkrugTotals[], void>({
      query: () => ({
        url: '/renovation/okrug-totals',
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
  }),

  overrideExisting: false,
});

export const {
  useGetOkrugTotalsQuery: useOkrugTotals,
  useGetDoneTimelineQuery: useDoneTimeline,
  useGetTotalDeviationsQuery: useTotalDeviations,
  useGetTotalAgesQuery: useTotalAges,
  useGetDoneByYearQuery: useDoneByYear,
  useGetStartTimelineQuery: useStartTimeline,
  useGetLastUpdatedDateQuery: useLastUpdatedDate,
} = renovationStatisticsApi;
