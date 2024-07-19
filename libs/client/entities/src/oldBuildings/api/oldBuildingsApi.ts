import { rtkApi } from '@urgp/client/shared';
import { GetOldBuldingsDto, OldBuilding } from '@urgp/shared/entities';

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
  }),
  overrideExisting: false,
});

export const useOldBuildingsGeoJson = oldBuildingsApi.useGetGeoJsonQuery;
export const useOldBuldings = oldBuildingsApi.useGetOldBuldingsQuery;
