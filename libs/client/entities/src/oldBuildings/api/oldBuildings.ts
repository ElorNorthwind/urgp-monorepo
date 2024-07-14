import { rtkApi } from '@urgp/client/shared';

import { GeoJsonObject } from 'geojson';

const oldBuildingsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getGeoJson: build.query<GeoJsonObject, void>({
      query: () => ({
        url: '/renovation/old-geojson',
        // params: { query },
      }),
    }),
  }),
  overrideExisting: false,
});

export const useOldBuildingsGeoJson = oldBuildingsApi.useGetGeoJsonQuery;
