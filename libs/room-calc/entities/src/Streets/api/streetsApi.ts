import { rtkApi } from '@urgp/shared/util';
import { Street } from '../model/types';

const streetsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getStreets: build.query<Street[], string>({
      query: (query) => ({
        url: '/db/streets',
        params: { query },
      }),
    }),
  }),
  overrideExisting: false,
});

export const useStreets = streetsApi.useGetStreetsQuery;
