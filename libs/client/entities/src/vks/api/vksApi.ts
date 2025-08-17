import { rtkApi } from '@urgp/client/shared';
import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  VkaSetIsTechnical,
  VksCase,
  VksCaseDetails,
  VksCasesQuery,
  VksDashbordPageSearch,
  VksDepartmentStat,
  VksServiceStat,
  VksStatusStat,
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
    getVksCaseById: build.query<VksCase | null, number>({
      query: (id) => ({
        url: `/vks/cases/${id.toString()}`,
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [
        'vks-case',
        { type: 'vks-case', id: arg },
      ],
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

    getVksStatusStats: build.query<
      VksStatusStat[],
      VksDashbordPageSearch | void
    >({
      query: (q) => ({
        url: `/vks/charts/status`,
        method: 'GET',
        params: {
          ...q,
        },
      }),
      providesTags: ['vks-classificator'],
    }),

    getVksDepartmentStats: build.query<
      VksDepartmentStat[],
      VksDashbordPageSearch | void
    >({
      query: (q) => ({
        url: `/vks/charts/department`,
        method: 'GET',
        params: {
          ...q,
        },
      }),
      providesTags: ['vks-classificator'],
    }),

    getVksServiceStats: build.query<
      VksServiceStat[],
      VksDashbordPageSearch | void
    >({
      query: (q) => ({
        url: `/vks/charts/service`,
        method: 'GET',
        params: {
          ...q,
        },
      }),
      providesTags: ['vks-classificator'],
    }),

    updateIsTechnical: build.mutation<boolean | null, VkaSetIsTechnical>({
      query: (dto) => ({
        url: '/vks/cases/is-technical',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: (result, error, arg) => [
        'vks-case',
        { type: 'vks-case', id: arg.caseId },
      ],
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetVksCasesQuery: useVksCases,
  useGetVksCaseByIdQuery: useVksCaseById,
  useGetVksCaseDetailsQuery: useVksCaseDetails,
  useGetVksDepartmentClassificatorQuery: useVksDepartmentClassificator,
  useGetVksServiceTypesClassificatorQuery: useVksServiceTypesClassificator,
  useGetVksStatusClassificatorQuery: useVksStatusClassificator,
  useGetVksTimelineQuery: useVksTimeline,
  useGetVksStatusStatsQuery: useVksStatusStats,
  useGetVksDepartmentStatsQuery: useVksDepartmentStats,
  useGetVksServiceStatsQuery: useVksServiceStats,

  useUpdateIsTechnicalMutation: useUpdateIsTechnical,
} = vksApi;
