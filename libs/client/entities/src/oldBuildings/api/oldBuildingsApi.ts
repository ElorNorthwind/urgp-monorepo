import { rtkApi } from '@urgp/client/shared';
import {
  ConnectedPlots,
  GetOldBuldingsDto,
  OldBuilding,
  OldBuildingRelocationMapElement,
} from '@urgp/shared/entities';

import { GeoJsonObject } from 'geojson';

export const oldBuildingsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getGeoJson: build.query<GeoJsonObject, void>({
      query: () => ({
        url: '/renovation/old-geojson',
      }),
    }),
    getOldBuldings: build.query<OldBuilding[], GetOldBuldingsDto>({
      query: (query) => {
        return {
          url: '/renovation/old-buildings',
          params: { ...query },
        };
      },
      // Only have one cache entry because the arg always maps to one string
      serializeQueryArgs: ({ queryArgs, endpointDefinition, endpointName }) => {
        return { ...queryArgs, offset: undefined };
      },
      // Always merge incoming data to the cache entry
      merge: (currentCache, newItems) => {
        currentCache.push(...newItems);
      },
      // Refetch when the page arg changes
      forceRefetch({ currentArg, previousArg }) {
        return currentArg?.offset !== previousArg?.offset;
      },
    }),

    getConnetedPlots: build.query<ConnectedPlots[], number>({
      query: (query) => ({
        url: '/renovation/connected-plots/' + query.toString(),
        method: 'GET',
      }),
    }),

    getOldBuildingList: build.query<{ value: number; label: string }[], void>({
      query: () => ({
        url: '/renovation/old-building-list',
        method: 'GET',
      }),
    }),

    getOldBuildingRelocationMap: build.query<
      OldBuildingRelocationMapElement[],
      number
    >({
      query: (query) => ({
        url: '/renovation/old-building-relocation-map/' + query.toString(),
        method: 'GET',
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetGeoJsonQuery: useOldBuildingsGeoJson,
  useGetOldBuldingsQuery: useOldBuldings,
  useGetConnetedPlotsQuery: useConnectedPlots,
  useGetOldBuildingListQuery: useOldBuildingList,
} = oldBuildingsApi;
