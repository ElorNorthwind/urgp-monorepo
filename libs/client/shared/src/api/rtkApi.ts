import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
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

export const rtkApi = createApi({
  //   baseQuery: axiosBaseQuery({
  //     baseUrl: process.env.API_URL || '/api',
  //   }),
  reducerPath: 'api',
  // ts-expect-error
  baseQuery: fetchBaseQuery({
    baseUrl: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
  }),
  endpoints: (builder) => ({}),
});
