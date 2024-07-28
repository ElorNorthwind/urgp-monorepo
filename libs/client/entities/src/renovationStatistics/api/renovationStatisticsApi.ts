import { rtkApi } from '@urgp/client/shared';
import { OkrugTotals } from '@urgp/shared/entities';

export const renovationStatisticsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getOkrugTotals: build.query<OkrugTotals[], void>({
      query: () => ({
        url: '/renovation/okrug-totals',
      }),
    }),
  }),
  overrideExisting: false,
});

export const useOkrugTotals = renovationStatisticsApi.useGetOkrugTotalsQuery;
