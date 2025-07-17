import { rtkApi } from '@urgp/client/shared';
import {
  CreateEquityOperationDto,
  DeleteControlEntityDto,
  EquityOperation,
  EquityOperationLogItem,
  NestedClassificatorInfo,
  UpdateEquityOperationDto,
} from '@urgp/shared/entities';
import { equityObjectsApi } from '../../equityObjects';

export const equityOperationsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getEquityOperationsByObjectId: build.query<EquityOperation[], number>({
      query: (objectId) => ({
        url: '/equity/by-object/' + objectId.toString() + '/operations',
        method: 'GET',
      }),
      providesTags: (result, error, arg) => [
        'equity-operations',
        { type: 'equity-operations', objectId: arg },
      ],
    }),
    getEquityOperationLog: build.query<EquityOperationLogItem[], void>({
      query: () => ({
        url: '/equity/operation-log',
        method: 'GET',
      }),
      providesTags: ['equity-operations', 'equity-objects'],
    }),
    createEquityOperation: build.mutation<
      EquityOperation[],
      CreateEquityOperationDto
    >({
      query: (dto) => ({
        url: '/equity/operation',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'equity-operations', objectId: arg.objectId },
      ],
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        await queryFulfilled.then(({ data }) => {
          data?.forEach((operation) => {
            operation?.objectId &&
              dispatch(
                equityObjectsApi.endpoints.getObjectById.initiate(
                  operation?.objectId,
                  {
                    forceRefetch: true,
                  },
                ),
              );
          });
        });
      },
    }),
    updateEquityOperation: build.mutation<
      EquityOperation[],
      UpdateEquityOperationDto
    >({
      query: (dto) => ({
        url: '/equity/operation',
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'equity-operations', objectId: arg.objectId },
      ],
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        await queryFulfilled.then(({ data }) => {
          data?.forEach((operation) => {
            operation?.objectId &&
              dispatch(
                equityObjectsApi.endpoints.getObjectById.initiate(
                  operation?.objectId,
                  {
                    forceRefetch: true,
                  },
                ),
              );
          });
        });
      },
    }),
    deleteEquityOperation: build.mutation<
      number | null,
      DeleteControlEntityDto
    >({
      query: (dto) => ({
        url: '/equity/operation',
        method: 'DELETE',
        body: dto,
      }),
      invalidatesTags: (result, error, arg) => [
        { type: 'equity-operations', objectId: arg?.id },
      ],
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        await queryFulfilled.then(({ data }) => {
          data &&
            dispatch(
              equityObjectsApi.endpoints.getObjectById.initiate(data, {
                forceRefetch: true,
              }),
            );
        });
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetEquityOperationsByObjectIdQuery: useEquityOperations,
  useCreateEquityOperationMutation: useCreateEquityOperation,
  useUpdateEquityOperationMutation: useUpdateEquityOperation,
  useDeleteEquityOperationMutation: useDeleteEquityOperation,
  useGetEquityOperationLogQuery: useEquityOperationLog,
} = equityOperationsApi;
