import { rtkApi } from '@urgp/client/shared';
import {
  CreateEquityOperationDto,
  DeleteControlEntityDto,
  EquityOperation,
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
    createEquityOperation: build.mutation<
      EquityOperation | null,
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
      async onQueryStarted(
        { objectId },
        { dispatch, queryFulfilled, getState },
      ) {
        dispatch(
          equityObjectsApi.endpoints.getObjectById.initiate(objectId, {
            forceRefetch: true,
          }),
        );
      },
    }),
    updateEquityOperation: build.mutation<
      EquityOperation | null,
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
      async onQueryStarted(
        { objectId },
        { dispatch, queryFulfilled, getState },
      ) {
        dispatch(
          equityObjectsApi.endpoints.getObjectById.initiate(objectId, {
            forceRefetch: true,
          }),
        );
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
} = equityOperationsApi;
