import { rtkApi } from '@urgp/client/shared';
import { AuthUserDto, UserTokens } from '@urgp/shared/entities';

export const authApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    signin: build.mutation<UserTokens, AuthUserDto>({
      query: (credentials) => ({
        url: '/auth/signin',
        method: 'POST',
        body: credentials,
      }),
    }),
  }),
  overrideExisting: false,
});

export const { useSigninMutation } = authApi;
