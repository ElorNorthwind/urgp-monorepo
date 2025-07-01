import { rtkApi } from '@urgp/client/shared';
import {
  EgrnDetails,
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
      providesTags: (result, error, arg) => [
        'equity-objects',
        { type: 'equity-objects', id: arg },
      ],

      // Not sure that is a good idea
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: newObject } = await queryFulfilled;
        const patchResult = dispatch(
          equityObjectsApi.util.updateQueryData(
            'getObjects',
            undefined,
            (draft: EquityObject[]) => {
              if (!newObject) return draft;
              const index = draft.findIndex(
                (object) => object.id === newObject?.id,
              );
              return [
                ...draft.slice(0, index),
                newObject,
                ...draft.slice(index + 1),
              ];
            },
          ),
        );
      },
    }),

    getEgrnById: build.query<EgrnDetails | null, number>({
      query: (objectId) => ({
        url: '/equity/by-object/' + objectId.toString() + '/egrn',
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [
        'equity-objects',
        { type: 'equity-objects', id: arg },
      ],
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
  useGetEgrnByIdQuery: useEquityEgrnById,
  useGetObjectsTotalsQuery: useEquityTotals,
  useGetObjectsTimelineQuery: useEquityTimeline,
  useGetComplexListQuery: useEquityComplexList,
} = equityObjectsApi;
