import { rtkApi } from '@urgp/client/shared';
import { CaseWithStatus } from '@urgp/shared/entities';

export const casesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getCases: build.query<CaseWithStatus[], void>({
      query: () => ({
        url: '/control/cases',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetCasesQuery: useCases } = casesApi;
