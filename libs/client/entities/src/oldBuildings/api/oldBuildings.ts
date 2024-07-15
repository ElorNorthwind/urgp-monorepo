import { rtkApi } from '@urgp/client/shared';
import { GetOldBuldingsDto, OldBuilding } from '@urgp/shared/entities';

import { GeoJsonObject } from 'geojson';

const oldBuildingsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getGeoJson: build.query<GeoJsonObject, void>({
      query: () => ({
        url: '/renovation/old-geojson',
      }),
    }),
    getOldBuldings: build.query<OldBuilding[], GetOldBuldingsDto>({
      query: (query) => ({
        url: '/renovation/old-buildings',
        params: { ...query },
      }),
    }),
  }),
  overrideExisting: false,
});

export const useOldBuildingsGeoJson = oldBuildingsApi.useGetGeoJsonQuery;
export const useOldBuldings = oldBuildingsApi.useGetOldBuldingsQuery;
