import { rtkApi } from '@urgp/client/shared';
import { EquityObject, EquityTotals } from '@urgp/shared/entities';

export const equityObjectsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getObjects: build.query<EquityObject[], void>({
      query: () => ({
        url: '/equity/objects',
        method: 'GET',
      }),
      providesTags: ['equity-objects'],
    }),

    getObjectById: build.query<EquityObject | null, number>({
      query: (objectId) => ({
        url: '/equity/object/' + objectId.toString(),
        method: 'GET',
      }),
      providesTags: ['equity-objects'],
    }),

    getObjectsTotals: build.query<EquityTotals[], void>({
      query: () => ({
        url: '/equity/objects/totals',
        method: 'GET',
      }),
      providesTags: ['equity-objects'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetObjectsQuery: useEquityObjects,
  useGetObjectByIdQuery: useEquityObjectById,
  useGetObjectsTotalsQuery: useEquityTotals,
} = equityObjectsApi;
