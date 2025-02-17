import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { clearUser, setUser } from './auth/authSlice';
import {
  CaseClasses,
  caseClassesValues,
  OperationClasses,
  operationClassesValues,
  User,
} from '@urgp/shared/entities';
// import type { BaseQueryFn } from '@reduxjs/toolkit/query';
// import axios from 'axios';
// import type { AxiosRequestConfig, AxiosError } from 'axios';

// const axiosBaseQuery =
//   (
//     { baseUrl }: { baseUrl: string } = { baseUrl: '' },
//   ): BaseQueryFn<
//     {
//       url: string;
//       method?: AxiosRequestConfig['method'];
//       data?: AxiosRequestConfig['data'];
//       params?: AxiosRequestConfig['params'];
//       headers?: AxiosRequestConfig['headers'];
//     },
//     unknown,
//     unknown
//   > =>
//   async ({ url, method, data, params, headers }) => {
//     try {
//       const result = await axios({
//         url: baseUrl + url,
//         method,
//         data,
//         params,
//         headers,
//       });
//       return { data: result.data };
//     } catch (axiosError) {
//       const err = axiosError as AxiosError;
//       return {
//         error: {
//           status: err.response?.status,
//           data: err.response?.data || err.message,
//         },
//       };
//     }
//   };

const baseQuery = fetchBaseQuery({
  baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  credentials: 'include',
});

const baseQueryWithReauth = async (args, api, extraOptions) => {
  let result = await baseQuery(args, api, extraOptions);

  if (result?.error?.status === 403) {
    // console.log('sending refresh token');
    // send refresh token to get new access token
    const refreshResult = await baseQuery('/auth/refresh', api, extraOptions);
    // console.log(refreshResult);
    if (refreshResult?.data) {
      api.dispatch(setUser(refreshResult.data as User));
      result = await baseQuery(args, api, extraOptions);
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
  ],
});
