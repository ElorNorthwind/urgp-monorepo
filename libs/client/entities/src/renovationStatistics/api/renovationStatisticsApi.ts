import { rtkApi } from '@urgp/client/shared';
import { DoneTimelinePoint, OkrugTotals } from '@urgp/shared/entities';

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
  }),

  overrideExisting: false,
});

export const useOkrugTotals = renovationStatisticsApi.useGetOkrugTotalsQuery;
export const useDoneTimeline = renovationStatisticsApi.useGetDoneTimelineQuery;
