import { rtkApi } from '@urgp/client/shared';
import {
  CasesPageFilter,
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  SelectOption,
  Classificator,
  UserControlData,
  UserControlSettings,
  UserApproveTo,
  UserApproveToChainData,
  UserNotificationSettings,
  UserTelegramStatus,
} from '@urgp/shared/entities';

export const classificatorsApi = rtkApi
  // .enhanceEndpoints({ addTagTypes: ['user-data', 'user-settings'] })
  .injectEndpoints({
    endpoints: (build) => ({
      getCurrentUserData: build.query<UserControlData, void>({
        query: () => ({
          url: '/control/classificators/user-data',
          method: 'GET',
        }),
        providesTags: ['user-data'],
      }),

      getCurrentUserApproveTo: build.query<UserApproveTo, void>({
        query: () => ({
          url: '/control/classificators/user-approve-to',
          method: 'GET',
        }),
        providesTags: ['user-data'],
      }),

      getCurrentUserApproveChains: build.query<UserApproveToChainData[], void>({
        query: () => ({
          url: '/control/classificators/user-approve-chains',
          method: 'GET',
        }),
        providesTags: ['user-data'],
      }),

      getCurrentUserSettings: build.query<UserControlSettings, void>({
        query: () => ({
          url: '/control/classificators/user-settings',
          method: 'GET',
        }),
        providesTags: ['user-settings'],
      }),

      setCurrentUserNotificationsSettings: build.mutation<
        UserControlSettings,
        UserNotificationSettings
      >({
        query: (notifications) => ({
          url: '/control/classificators/user-settings/notifications',
          method: 'PATCH',
          body: notifications,
        }),
        invalidatesTags: ['user-settings'],
        // async onQueryStarted(ids, { dispatch }) {
        //   dispatch(
        //     classificatorsApi.util.updateQueryData(
        //       'getCurrentUserSettings',
        //       undefined,
        //       (draft) => {
        //         return { ...draft, directions: ids };
        //       },
        //     ),
        //   );
        // },
      }),
      setCurrentUserDirections: build.mutation<UserControlSettings, number[]>({
        query: (directions) => ({
          url: '/control/classificators/user-settings/directions',
          method: 'PATCH',
          body: { directions },
        }),
        invalidatesTags: ['user-settings'],
        // async onQueryStarted(ids, { dispatch }) {
        //   dispatch(
        //     classificatorsApi.util.updateQueryData(
        //       'getCurrentUserSettings',
        //       undefined,
        //       (draft) => {
        //         return { ...draft, directions: ids };
        //       },
        //     ),
        //   );
        // },
      }),
      setCurrentUserCaseFilter: build.mutation<
        UserControlSettings,
        CasesPageFilter
      >({
        query: (filter) => ({
          url: '/control/classificators/user-settings/case-filter',
          method: 'PATCH',
          body: filter,
        }),
        async onQueryStarted(filter, { dispatch }) {
          dispatch(
            classificatorsApi.util.updateQueryData(
              'getCurrentUserSettings',
              undefined,
              (draft) => {
                return { ...draft, casesFilter: filter };
              },
            ),
          );
        },
      }),

      getControlExecutors: build.query<SelectOption<number>[], void>({
        query: () => ({
          url: '/control/classificators/executors',
          method: 'GET',
        }),
        providesTags: ['classificator'],
      }),

      getUserControlTo: build.query<NestedClassificatorInfo[], number[] | void>(
        {
          query: (extraIds) => ({
            url: '/control/classificators/control-to',
            method: 'GET',
            params: { extraIds },
          }),
          providesTags: ['classificator'],
        },
      ),

      getEscalationTargets: build.query<SelectOption<number>[], void>({
        query: () => ({
          url: '/control/classificators/escalation-targets',
          method: 'GET',
        }),
        providesTags: ['classificator'],
      }),
      getCaseTypes: build.query<NestedClassificatorInfo[], void>({
        query: () => ({
          url: '/control/classificators/case-types',
          method: 'GET',
        }),
        providesTags: ['classificator'],
      }),
      getOperationTypes: build.query<NestedClassificatorInfo[], void>({
        query: () => ({
          url: '/control/classificators/operation-types',
          method: 'GET',
        }),
        providesTags: ['classificator'],
      }),
      getOperationTypesFlat: build.query<Classificator[], void>({
        query: () => ({
          url: '/control/classificators/operation-types-flat',
          method: 'GET',
        }),
        providesTags: ['classificator'],
      }),
      getCaseStatusTypes: build.query<NestedClassificatorInfo[], void>({
        query: () => ({
          url: '/control/classificators/case-status-types',
          method: 'GET',
        }),
        providesTags: ['classificator'],
      }),
      getCaseDirectionTypes: build.query<NestedClassificatorInfo[], void>({
        query: () => ({
          url: '/control/classificators/case-direction-types',
          method: 'GET',
        }),
        providesTags: ['classificator'],
      }),
      getDepartmentTypes: build.query<NestedClassificatorInfoString[], void>({
        query: () => ({
          url: '/control/classificators/case-department-types',
          method: 'GET',
        }),
        providesTags: ['classificator'],
      }),
      getUserTelegramStatus: build.query<UserTelegramStatus, void>({
        query: () => ({
          url: '/control/classificators/telegram-status',
          method: 'GET',
        }),
        providesTags: ['classificator'],
      }),
    }),
    overrideExisting: false,
  });

export const {
  useGetCurrentUserDataQuery: useCurrentUserData,
  useGetCurrentUserSettingsQuery: useCurrentUserSettings,
  useSetCurrentUserDirectionsMutation: useSetCurrentUserDirections,
  useSetCurrentUserCaseFilterMutation: useSetCurrentUserCaseFilter,
  useSetCurrentUserNotificationsSettingsMutation: useSetNotificationsSettings,
  useGetCurrentUserApproveToQuery: useCurrentUserApproveTo,
  useGetCurrentUserApproveChainsQuery: useCurrentUserApproveChains,
  useGetEscalationTargetsQuery: useEscalationTargets,
  useGetControlExecutorsQuery: useControlExecutors,
  useGetUserControlToQuery: useUserControlTo,
  useGetCaseTypesQuery: useCaseTypes,
  useGetOperationTypesQuery: useOperationTypes,
  useGetOperationTypesFlatQuery: useOperationTypesFlat,
  useGetCaseStatusTypesQuery: useCaseStatusTypes,
  useGetCaseDirectionTypesQuery: useCaseDirectionTypes,
  useGetDepartmentTypesQuery: useDepartmentTypes,
  useGetUserTelegramStatusQuery: useUserTelegramStatus,
} = classificatorsApi;
