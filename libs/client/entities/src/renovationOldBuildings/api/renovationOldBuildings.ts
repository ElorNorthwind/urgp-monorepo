import { rtkApi } from '@urgp/shared/util';

import { GeoJsonObject } from 'geojson';

const renovationOldBuildingsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getOldBuildings: build.query<GeoJsonObject, void>({
      query: () => ({
        url: '/renovation/old-geojson',
        // params: { query },
      }),
    }),
  }),
  overrideExisting: false,
});

export const useOldBuildings =
  renovationOldBuildingsApi.useGetOldBuildingsQuery;
