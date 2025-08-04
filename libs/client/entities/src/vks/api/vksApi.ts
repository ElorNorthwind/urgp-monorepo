import { rtkApi } from '@urgp/client/shared';
import { VksCase, VksCaseDetails, VksCasesQuery } from '@urgp/shared/entities';

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
    getVksCaseDetails: build.query<VksCaseDetails, number>({
      query: (id) => ({
        url: `/vks/cases/${id.toString()}/details`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [
        'vks-case',
        { type: 'vks-case', id: arg },
      ],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVksCasesQuery: useVksCases,
  useGetVksCaseDetailsQuery: useVksCaseDetails,
} = vksApi;
