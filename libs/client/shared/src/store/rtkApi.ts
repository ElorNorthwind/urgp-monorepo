import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearUser, setUser } from './auth/authSlice';
import {
  CaseClasses,
  caseClassesValues,
  OperationClasses,
  operationClassesValues,
  User,
} from '@urgp/shared/entities';
import { RootState } from './store';

// const result = dispatch(
//   casesApi.endpoints.getCaseByOperationId.initiate(opId),
// );

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  const state = api.getState() as RootState;
  const poseUser = state.auth.poseAsUser;

  let result = await baseQuery(
    { ...args, headers: { 'pose-user-id': poseUser?.id?.toString() } },
    api,
    extraOptions,
  );

  if (result?.error?.status === 403) {
    // send refresh token to get new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    if (refreshResult?.data) {
      api.dispatch(setUser(refreshResult.data as User));
      result = await baseQuery(
        { ...args, headers: { 'pose-user-id': poseUser?.id?.toString() } },
        api,
        extraOptions,
      );
    } else {
      api.dispatch(clearUser());
    }
  }

  return result;
};

export const rtkApi = createApi({
  //   baseQuery: axiosBaseQuery({
  //     baseUrl: process.env.API_URL || '/api',
  //   }),
  reducerPath: 'api',
  // ts-expect-error
  // baseQuery: fetchBaseQuery({
  //   baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  //   credentials: 'include',
  // }),
  baseQuery: baseQueryWithReauth,
  endpoints: (builder) => ({}),
  tagTypes: [
    'user-data',
    'user-settings',
    'classificator',
    ...caseClassesValues,
    ...operationClassesValues,
    'address-session',
    'address-result',
    'old-building-date',
    'equity-objects',
    'equity-claims',
    'equity-operations',
    'equity-classificators',
  ],
});
