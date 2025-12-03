import { rtkApi } from '@urgp/client/shared';
import {
  RenovationNewBuilding,
  RenovationNewBuildingDeviationTotals,
  RenovationNewBuildingStatusTotals,
} from '@urgp/shared/entities';

export const newBuildingsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getNewBuildings: build.query<RenovationNewBuilding[], void>({
      query: () => ({
        url: '/renovation/new-buildings/all',
        methor: 'GET',
      }),
    }),
    getNewBuildingsStatusTotals: build.query<
      RenovationNewBuildingStatusTotals,
      void
    >({
      query: () => ({
        url: '/renovation/new-buildings/status-totals',
        methor: 'GET',
      }),
    }),
    getNewBuildingsDeviationTotals: build.query<
      RenovationNewBuildingDeviationTotals[],
      void
    >({
      query: () => ({
        url: '/renovation/new-buildings/deviation-totals',
        methor: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetNewBuildingsQuery: useNewBuildings,
  useGetNewBuildingsStatusTotalsQuery: useNewBuildingsStatusTotals,
  useGetNewBuildingsDeviationTotalsQuery: useNewBuildingsDeviationTotals,
} = newBuildingsApi;
