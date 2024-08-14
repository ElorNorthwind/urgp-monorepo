import { rtkApi } from '@urgp/client/shared';
import {
  CityTotalDeviations,
  DoneTimelinePoint,
  OkrugTotals,
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
  useGetLastUpdatedDateQuery: useLastUpdatedDate,
} = renovationStatisticsApi;
