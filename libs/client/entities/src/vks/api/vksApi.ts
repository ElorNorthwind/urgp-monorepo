import { rtkApi } from '@urgp/client/shared';
import { VksCase, VksCasesQuery } from '@urgp/shared/entities';

export const vksApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getVksCases: build.query<VksCase[], VksCasesQuery>({
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

export const { useGetVksCasesQuery: useVksCases } = vksApi;
