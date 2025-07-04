import { rtkApi } from '@urgp/client/shared';
import { NestedClassificatorInfo } from '@urgp/shared/entities';

export const equityClassificatorsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getBuildings: build.query<NestedClassificatorInfo[], void>({
      query: () => ({
        url: '/equity/classificators/buildings',
        method: 'GET',
      }),
      providesTags: ['equity-operations'],
    }),
    getEquityOperationTypes: build.query<NestedClassificatorInfo[], void>({
      query: () => ({
        url: '/equity/classificators/operation-type',
        method: 'GET',
      }),
      providesTags: ['equity-operations'],
    }),
    getObjectTypes: build.query<NestedClassificatorInfo[], void>({
      query: () => ({
        url: '/equity/classificators/object-type',
        method: 'GET',
      }),
      providesTags: ['equity-operations'],
    }),
    getObjectStatus: build.query<NestedClassificatorInfo[], void>({
      query: () => ({
        url: '/equity/classificators/object-status',
        method: 'GET',
      }),
      providesTags: ['equity-operations'],
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetBuildingsQuery: useEquityBuildings,
  useGetEquityOperationTypesQuery: useEquityOperationTypes,
  useGetObjectTypesQuery: useEquityObjectTypes,
  useGetObjectStatusQuery: useEquityObjectStatus,
} = equityClassificatorsApi;
