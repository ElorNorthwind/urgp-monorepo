import { rtkApi } from '@urgp/client/shared';
import { VksCaseSlim, VksCasesQuery } from '@urgp/shared/entities';

export const vksApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getVksSlimCases: build.query<VksCaseSlim[], VksCasesQuery>({
      query: (q) => ({
        url: '/vks/cases/',
        method: 'GET',
        params: q,
      }),
      providesTags: ['vks-case'],
    }),
  }),
  overrideExisting: false,
});

export const { useGetVksSlimCasesQuery: useVksSlimCases } = vksApi;
