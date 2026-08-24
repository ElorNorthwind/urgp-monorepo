import { rtkApi } from '@urgp/client/shared';
import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  UPDATE_STATES,
  UpdateDgiVksSurveyHousingForm,
  UpdateStatus,
  VkaSetBooleanFlag,
  VksCase,
  VksCaseDetails,
  VksCasesQuery,
  VksDailySlotStats,
  VksDashbordPageSearch,
  VksDepartmentStat,
  VksServiceStat,
  VksStatusStat,
  VksTimelinePoint,
  VksUserStats,
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
    getVksCasesPublic: build.query<VksCase[], VksCasesQuery>({
      query: (q) => ({
        url: '/vks/public/cases/',
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
    getVksCaseByIdPublic: build.query<VksCase | null, number>({
      query: (id) => ({
        url: `/vks/public/cases/${id.toString()}`,
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
    getVksCaseDetailsPublic: build.query<VksCaseDetails, number>({
      query: (id) => ({
        url: `/vks/public/cases/${id.toString()}/details`,
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

    getVksDailySlotStats: build.query<
      VksDailySlotStats[],
      VksDashbordPageSearch | void
    >({
      query: (q) => ({
        url: `/vks/charts/daily-slots`,
        method: 'GET',
        params: {
          ...q,
        },
      }),
      providesTags: ['vks-classificator'],
    }),

    getVksUserStats: build.query<VksUserStats[], VksDashbordPageSearch | void>({
      query: (q) => ({
        url: `/vks/charts/user-stats`,
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

    updateIsTechnical: build.mutation<boolean | null, VkaSetBooleanFlag>({
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

    updateIsSentToYandex: build.mutation<boolean | null, VkaSetBooleanFlag>({
      query: (dto) => ({
        url: '/vks/cases/sent-to-yandex',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: (result, error, arg) => [
        'vks-case',
        { type: 'vks-case', id: arg.caseId },
      ],
    }),

    getVksUsersClassificator: build.query<NestedClassificatorInfo[], void>({
      query: () => ({
        url: `/vks/classificators/users`,
        method: 'GET',
      }),
      providesTags: ['vks-classificator'],
    }),

    updateVksDgiSurvey: build.mutation<void, UpdateDgiVksSurveyHousingForm>({
      query: (dto) => ({
        url: '/vks/cases/dgi-survey',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: (_result, _error, arg) => [
        'vks-case',
        { type: 'vks-case', id: arg.id },
      ],
    }),

    triggerVksUpdate: build.mutation<string, void>({
      query: () => ({
        url: `/vks/update/manual`,
        method: 'POST',
      }),
    }),

    getVksUpdateStatus: build.query<UpdateStatus, void>({
      query: () => ({
        url: '/vks/update/status',
        method: 'GET',
      }),
    }),

    getVksUpdateStream: build.query<UpdateStatus, void>({
      // queryFn: () => ({
      //   data: {
      //     name: 'vks',
      //     state: UPDATE_STATES['IDLE'],
      //     progress: 0,
      //     message: 'Соединение...',
      //   },
      // }),
      query: () => ({
        url: '/vks/update/status',
        method: 'GET',
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        const eventSource = new EventSource(
          (import.meta.env?.['VITE_API_URL'] || 'http://localhost:8000/api') +
            '/vks/update/stream',
        );

        eventSource.onmessage = (event) => {
          try {
            const status: UpdateStatus = JSON.parse(event.data);
            updateCachedData((draft) => {
              Object.assign(draft, status);
            });
          } catch (error) {
            console.error('Не удалось получить SSE события с сервера: ', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('Ошибка с SSE событием: ', error);
          updateCachedData((draft) => {
            draft.message = 'Соединение потеряно, попытка подключения...';
          });
        };

        await cacheEntryRemoved;
        eventSource.close();
      },
    }),

    triggerDmUpdate: build.mutation<{ message: string }, void>({
      query: () => ({
        url: `/vks/dm/update/manual`,
        method: 'POST',
      }),
    }),

    getDmUpdateStatus: build.query<UpdateStatus, void>({
      query: () => ({
        url: '/vks/dm/update/status',
        method: 'GET',
      }),
    }),

    getDmUpdateStream: build.query<UpdateStatus, void>({
      // queryFn: () => ({
      //   data: {
      //     name: 'dm',
      //     state: UPDATE_STATES['IDLE'],
      //     progress: 0,
      //     message: 'Соединение...',
      //   },
      // }),
      query: () => ({
        url: '/vks/dm/update/status',
        method: 'GET',
      }),
      async onCacheEntryAdded(
        arg,
        { updateCachedData, cacheDataLoaded, cacheEntryRemoved },
      ) {
        // await cacheDataLoaded;

        const eventSource = new EventSource(
          (import.meta.env?.['VITE_API_URL'] || 'http://localhost:8000/api') +
            '/vks/dm/update/stream',
        );

        eventSource.onmessage = (event) => {
          try {
            const status: UpdateStatus = JSON.parse(event.data);
            updateCachedData((draft) => {
              Object.assign(draft, status);
            });
          } catch (error) {
            console.error('Не удалось получить SSE события с сервера: ', error);
          }
        };

        eventSource.onerror = (error) => {
          console.error('Ошибка с SSE событием: ', error);
          updateCachedData((draft) => {
            draft.message = 'Соединение потеряно, попытка подключения...';
          });
        };

        await cacheEntryRemoved;
        eventSource.close();
      },
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetVksCasesQuery: useVksCases,
  useGetVksCasesPublicQuery: useVksCasesPublic,

  useGetVksCaseByIdQuery: useVksCaseById,
  useGetVksCaseByIdPublicQuery: useVksCaseByIdPublic,

  useGetVksCaseDetailsQuery: useVksCaseDetails,
  useGetVksCaseDetailsPublicQuery: useVksCaseDetailsPublic,

  useGetVksDepartmentClassificatorQuery: useVksDepartmentClassificator,
  useGetVksServiceTypesClassificatorQuery: useVksServiceTypesClassificator,
  useGetVksStatusClassificatorQuery: useVksStatusClassificator,
  useGetVksTimelineQuery: useVksTimeline,
  useGetVksStatusStatsQuery: useVksStatusStats,
  useGetVksDepartmentStatsQuery: useVksDepartmentStats,
  useGetVksServiceStatsQuery: useVksServiceStats,
  useGetVksDailySlotStatsQuery: useVksDailySlotStats,
  useGetVksUserStatsQuery: useVksUserStats,

  useUpdateIsTechnicalMutation: useUpdateIsTechnical,
  useUpdateIsSentToYandexMutation: useUpdateIsSentToYandex,

  useGetVksUsersClassificatorQuery: useVksUsersClassificator,
  useUpdateVksDgiSurveyMutation: useUpdateVksDgiSurvey,

  useTriggerVksUpdateMutation: useTriggerVksUpdate,
  useGetVksUpdateStatusQuery: useVksUpdateStatus,
  useGetVksUpdateStreamQuery: useVksUpdateStream,

  useTriggerDmUpdateMutation: useTriggerDmUpdate,
  useGetDmUpdateStatusQuery: useDmUpdateStatus,
  useGetDmUpdateStreamQuery: useDmUpdateStream,
} = vksApi;
