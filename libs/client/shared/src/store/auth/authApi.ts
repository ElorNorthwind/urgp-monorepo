import { AuthUserDto, UserTokens } from '@urgp/shared/entities';
import { rtkApi } from '../../api/rtkApi';

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
