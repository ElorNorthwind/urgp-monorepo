import { rtkApi } from '@urgp/client/shared';
import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  VksCase,
  VksCaseDetails,
  VksCasesQuery,
  VksTimelinePoint,
} from '@urgp/shared/entities';

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
    getVksServiceTypesClassificator: build.query<
      NestedClassificatorInfoString[],
      void
    >({
      query: () => ({
        url: `/vks/classificators/service-types`,
        method: 'GET',
      }),
      providesTags: ['vks-classificator'],
    }),
    getVksDepartmentClassificator: build.query<NestedClassificatorInfo[], void>(
      {
        query: () => ({
          url: `/vks/classificators/departments`,
          method: 'GET',
        }),
        providesTags: ['vks-classificator'],
      },
    ),
    getVksStatusClassificator: build.query<
      NestedClassificatorInfoString[],
      void
    >({
      query: () => ({
        url: `/vks/classificators/statuses`,
        method: 'GET',
      }),
      providesTags: ['vks-classificator'],
    }),
    getVksTimeline: build.query<VksTimelinePoint[], number[] | void>({
      query: (departmentIds) => ({
        url: `/vks/charts/timeline`,
        method: 'GET',
        params: { departmentIds },
      }),
      providesTags: ['vks-classificator'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetVksCasesQuery: useVksCases,
  useGetVksCaseDetailsQuery: useVksCaseDetails,
  useGetVksDepartmentClassificatorQuery: useVksDepartmentClassificator,
  useGetVksServiceTypesClassificatorQuery: useVksServiceTypesClassificator,
  useGetVksStatusClassificatorQuery: useVksStatusClassificator,
  useGetVksTimelineQuery: useVksTimeline,
} = vksApi;
