import { rtkApi } from '@urgp/client/shared';
import { Case } from '@urgp/shared/entities';

export const casesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getCases: build.query<Case[], void>({
      query: () => ({
        url: '/control/case/all',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useGetCasesQuery: useCases } = casesApi;
