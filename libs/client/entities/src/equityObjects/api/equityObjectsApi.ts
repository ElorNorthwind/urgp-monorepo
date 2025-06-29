import { rtkApi } from '@urgp/client/shared';
import {
  EquityComplexData,
  EquityObject,
  EquityTimeline,
  EquityTotals,
} from '@urgp/shared/entities';

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

    getObjectsTimeline: build.query<EquityTimeline[], void>({
      query: () => ({
        url: '/equity/objects/timeline',
        method: 'GET',
      }),
      providesTags: ['equity-objects'],
    }),

    getComplexList: build.query<EquityComplexData[], void>({
      query: () => ({
        url: '/equity/complex-list',
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
  useGetObjectsTimelineQuery: useEquityTimeline,
  useGetComplexListQuery: useEquityComplexList,
} = equityObjectsApi;
