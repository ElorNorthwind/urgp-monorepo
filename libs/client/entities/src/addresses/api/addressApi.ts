import { rtkApi } from '@urgp/client/shared';
import {
  AddressResult,
  AddressSessionFull,
  CreateAddressSessionDto,
  RatesDailyUsage,
} from '@urgp/shared/entities';

export const addressApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getDailyRatesUsage: build.query<RatesDailyUsage, void>({
      query: (id) => ({
        url: `/address/rates-usage`,
        method: 'GET',
      }),
      providesTags: ['address-session'],
    }),

    getSessionById: build.query<AddressSessionFull, number>({
      query: (id) => ({
        url: `/address/session/${id.toString()}`,
        method: 'GET',
      }),
      providesTags: ['address-session'],
    }),

    getSessionResult: build.query<any[], number>({
      query: (id) => ({
        url: `/address/results/${id.toString()}`,
        method: 'GET',
      }),
      providesTags: ['address-result'],
    }),

    getUserSessions: build.query<AddressSessionFull[], void>({
      query: (id) => ({
        url: `/address/user-sessions`,
        method: 'GET',
      }),
      providesTags: ['address-session'],
    }),

    getSessionsQueue: build.query<AddressSessionFull[], void>({
      query: () => ({
        url: `/address/session-queue`,
        method: 'GET',
      }),
      providesTags: ['address-session'],
    }),

    refreshSessionsQueue: build.mutation<undefined, void>({
      query: () => ({
        url: `/address/session/refresh-queue`,
        method: 'POST',
      }),
      invalidatesTags: ['address-session'],
    }),

    createSession: build.mutation<AddressSessionFull, CreateAddressSessionDto>({
      query: (dto: CreateAddressSessionDto) => ({
        url: `/address/session`,
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: ['address-session'],
    }),

    deleteSession: build.mutation<null, number>({
      query: (id: number) => ({
        url: `/address/session`,
        method: 'DELETE',
        body: { id },
      }),
      invalidatesTags: ['address-session'],
    }),

    resetSessionErrors: build.mutation<null, number>({
      query: (id: number) => ({
        url: `/address/session/reset-errors`,
        method: 'POST',
        body: { id },
      }),
      invalidatesTags: ['address-session'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateSessionMutation: useCreateSession,
  useDeleteSessionMutation: useDeleteSession,
  useResetSessionErrorsMutation: useResetSessionErrors,
  useGetSessionByIdQuery: useGetSessionById,
  useGetUserSessionsQuery: useGetUserSessions,
  // useGetFiasDailyUsageQuery: useGetFiasUsage,
  useGetDailyRatesUsageQuery: useGetRatesUsage,
  useGetSessionsQueueQuery: useGetSessionsQueue,
  useRefreshSessionsQueueMutation: useRefreshSessionsQueue,
  useGetSessionResultQuery: useSessionResults,
  useLazyGetSessionResultQuery: useLazySessionResults,
} = addressApi;
