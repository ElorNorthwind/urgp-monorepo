import { rtkApi } from '@urgp/client/shared';
import {
  AddressSessionFull,
  CreateAddressSessionDto,
} from '@urgp/shared/entities';

export const addressApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getSessionById: build.query<AddressSessionFull, number>({
      query: (id) => ({
        url: `/address/session/${id.toString()}`,
        method: 'GET',
      }),
      providesTags: ['address-session'],
    }),

    getUserSessions: build.query<AddressSessionFull[], void>({
      query: (id) => ({
        url: `/address/user-sessions`,
        method: 'GET',
      }),
      providesTags: ['address-session'],
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
  }),
  overrideExisting: false,
});

export const {
  useCreateSessionMutation: useCreateSession,
  useDeleteSessionMutation: useDeleteSession,
  useGetSessionByIdQuery: useGetSessionById,
  useGetUserSessionsQuery: useGetUserSessions,
} = addressApi;
