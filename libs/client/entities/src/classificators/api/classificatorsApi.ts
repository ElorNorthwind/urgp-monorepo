import { rtkApi } from '@urgp/client/shared';
import {
  NestedClassificatorInfo,
  NestedClassificatorInfoString,
  SelectOption,
  TypeInfo,
  UserControlApprovers,
  UserControlData,
} from '@urgp/shared/entities';

export const classificatorsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getCurrentUserData: build.query<UserControlData, void>({
      query: () => ({
        url: '/control/classificators/user-data',
        method: 'GET',
      }),
    }),
    getCurrentUserApprovers: build.query<UserControlApprovers, void>({
      query: () => ({
        url: '/control/classificators/user-approvers',
        method: 'GET',
      }),
    }),
    getControlExecutors: build.query<SelectOption<number>[], void>({
      query: () => ({
        url: '/control/classificators/executors',
        method: 'GET',
      }),
    }),
    getCaseTypes: build.query<NestedClassificatorInfo[], void>({
      query: () => ({
        url: '/control/classificators/case-types',
        method: 'GET',
      }),
    }),
    getOperationTypes: build.query<NestedClassificatorInfo[], void>({
      query: () => ({
        url: '/control/classificators/operation-types',
        method: 'GET',
      }),
    }),
    getOperationTypesFlat: build.query<TypeInfo[], void>({
      query: () => ({
        url: '/control/classificators/operation-types-flat',
        method: 'GET',
      }),
    }),
    getCaseStatusTypes: build.query<NestedClassificatorInfo[], void>({
      query: () => ({
        url: '/control/classificators/case-status-types',
        method: 'GET',
      }),
    }),
    getCaseDirectionTypes: build.query<NestedClassificatorInfo[], void>({
      query: () => ({
        url: '/control/classificators/case-direction-types',
        method: 'GET',
      }),
    }),
    getDepartmentTypes: build.query<NestedClassificatorInfoString[], void>({
      query: () => ({
        url: '/control/classificators/case-department-types',
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCurrentUserDataQuery: useCurrentUserData,
  useGetCurrentUserApproversQuery: useCurrentUserApprovers,
  useGetControlExecutorsQuery: useControlExecutors,
  useGetCaseTypesQuery: useCaseTypes,
  useGetOperationTypesQuery: useOperationTypes,
  useGetOperationTypesFlatQuery: useOperationTypesFlat,
  useGetCaseStatusTypesQuery: useCaseStatusTypes,
  useGetCaseDirectionTypesQuery: useCaseDirectionTypes,
  useGetDepartmentTypesQuery: useDepartmentTypes,
} = classificatorsApi;
