import { defaultSerializeQueryArgs } from '@reduxjs/toolkit/query';
import { rtkApi, store } from '@urgp/client/shared';
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

      // serializeQueryArgs: (endpoint) => {
      //   return defaultSerializeQueryArgs({
      //     ...endpoint,
      //     // Don't serialize the pageToken or limit into the cache key so subsequent pages are added to the existing cache entry
      //     queryArgs: { ...endpoint.queryArgs, page: undefined },
      //   });
      // },
      // merge: (currentData, nextPageData, args) => {
      //   if (!Array.isArray(currentData.data)) {
      //     currentData.data = []
      //   }
      //   if (Array.isArray(nextPageData.data)) {
      //     currentData.data.push(...nextPageData.data)
      //   }
      //   currentData.pageToken = nextPageData.pageToken
      // },
      // merge: (currentCache, newItems) => {
      //   currentCache.push(...newItems);
      // },
    }),
  }),
  overrideExisting: false,
});

export const useOldBuildingsGeoJson = oldBuildingsApi.useGetGeoJsonQuery;
export const useOldBuldings = oldBuildingsApi.useGetOldBuldingsQuery;
