import { AuthUserDto, User, UserTokens } from '@urgp/shared/entities';
import { rtkApi } from '../rtkApi';

export const authApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<User, AuthUserDto>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
      // transformResponse: (response: { data: User }, meta, arg) => response.data,
      // transformErrorResponse: (
      //   response: { status: string | number },
      //   meta,
      //   arg,
      // ) => response.status,
      // transformErrorResponse: (response) => {
      //   return response.data;
      // },
    }),
    logout: build.mutation<void, void>({
      query: () => ({
        url: '/auth/logout',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useLoginMutation, useLogoutMutation } = authApi;
