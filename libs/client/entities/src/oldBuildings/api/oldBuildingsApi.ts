import { rtkApi } from '@urgp/client/shared';
import {
  ConnectedPlots,
  GetOldBuldingsDto,
  OldBuilding,
  BuildingRelocationMapElement,
  BuildingsGeoJSON,
  NewBuilding,
  OldBuildingConnectionsInfo,
} from '@urgp/shared/entities';

export const oldBuildingsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getGeoJson: build.query<BuildingsGeoJSON, void>({
      query: () => ({
        url: '/renovation/old-geojson',
      }),
    }),
    // TODO: move to new building entity
    getPlotsGeoJson: build.query<BuildingsGeoJSON, void>({
      query: () => ({
        url: '/renovation/new-geojson',
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

    getOldBuldingById: build.query<OldBuilding, number>({
      query: (query) => ({
        url: '/renovation/old-building/' + query.toString(),
        method: 'GET',
      }),
    }),

    // TODO: move to new building entity
    getNewBuldingById: build.query<NewBuilding, number>({
      query: (query) => ({
        url: '/renovation/new-building/' + query.toString(),
        method: 'GET',
      }),
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
      BuildingRelocationMapElement[],
      number
    >({
      query: (query) => ({
        url: '/renovation/old-building-relocation-map/' + query.toString(),
        method: 'GET',
      }),
    }),

    // TODO: move to new buildings entity
    getNewBuildingRelocationMap: build.query<
      BuildingRelocationMapElement[],
      number
    >({
      query: (query) => ({
        url: '/renovation/new-building-relocation-map/' + query.toString(),
        method: 'GET',
      }),
    }),
    getOldBuildingConnections: build.query<OldBuildingConnectionsInfo, number>({
      query: (query) => ({
        url: '/renovation/old-building-connections/' + query.toString(),
        methor: 'GET',
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useGetGeoJsonQuery: useOldBuildingsGeoJson,
  useGetPlotsGeoJsonQuery: useNewBuildingsGeoJson,
  useGetOldBuldingsQuery: useOldBuldings,
  useGetOldBuldingByIdQuery: useOldBuldingById,
  useGetNewBuldingByIdQuery: useNewBuldingById,
  useGetConnetedPlotsQuery: useConnectedPlots,
  useGetOldBuildingListQuery: useOldBuildingList,
  useGetOldBuildingRelocationMapQuery: useOldBuildingRelocationMap,
  useGetNewBuildingRelocationMapQuery: useNewBuildingRelocationMap,
  useGetOldBuildingConnectionsQuery: useOldBuildingConnections,
} = oldBuildingsApi;
