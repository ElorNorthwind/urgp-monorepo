import {
  AuthUserDto,
  changePassword,
  ChangeUserPasswordDto,
  User,
} from '@urgp/shared/entities';
import { rtkApi } from '../rtkApi';

export const authApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    login: build.mutation<User, AuthUserDto>({
      query: (credentials) => ({
        url: '/auth/login',
        method: 'POST',
        body: credentials,
      }),
    }),

    changePassword: build.mutation<string, ChangeUserPasswordDto>({
      query: (dto) => ({
        url: '/auth/change-password',
        method: 'POST',
        body: dto,
      }),
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

export const {
  useLoginMutation,
  useLogoutMutation,
  useChangePasswordMutation,
} = authApi;
