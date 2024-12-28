import { rtkApi } from '@urgp/client/shared';
import {
  ControlOperationPayloadHistoryData,
  ControlStage,
  ControlStageCreateDto,
  ControlStageSlim,
  ControlStageUpdateDto,
  UserInputDeleteDto,
} from '@urgp/shared/entities';

export const operationsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getStagesByCaseId: build.query<ControlStage[], number>({
      query: (id) => ({
        url: '/control/operation/stage/by-case/' + id.toString(),
        method: 'GET',
      }),
    }),

    getOperationPayloadHistroy: build.query<
      ControlOperationPayloadHistoryData[],
      number
    >({
      query: (id) => ({
        url: '/control/operation/' + id.toString() + '/history',
        method: 'GET',
      }),
    }),

    creteStage: build.mutation<ControlStage, ControlStageCreateDto>({
      query: (dto) => ({
        url: '/control/operation/stage',
        method: 'POST',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: createdOperation } = await queryFulfilled;
        createdOperation?.caseId &&
          createdOperation?.id &&
          dispatch(
            operationsApi.util.updateQueryData(
              'getStagesByCaseId',
              createdOperation.caseId,
              (draft) => {
                return [createdOperation, ...draft];
              },
            ),
          );
      },
    }),

    updateStage: build.mutation<ControlStage, ControlStageUpdateDto>({
      query: (dto) => ({
        url: '/control/operation/stage',
        method: 'PATCH',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: updatedOperation } = await queryFulfilled;
        updatedOperation?.caseId &&
          updatedOperation?.id &&
          dispatch(
            operationsApi.util.updateQueryData(
              'getStagesByCaseId',
              updatedOperation.caseId,
              (draft) => {
                const index = draft.findIndex(
                  (stage) => stage.id === updatedOperation.id,
                );
                return [
                  ...draft.slice(0, index),
                  updatedOperation,
                  ...draft.slice(index + 1),
                ];
              },
            ),
          );
      },
    }),

    deleteOperation: build.mutation<ControlStage, UserInputDeleteDto>({
      query: (dto) => ({
        url: '/control/operation',
        method: 'DELETE',
        body: dto,
      }),

      async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
        const { data: deletedOperation } = await queryFulfilled;
        deletedOperation?.caseId &&
          dispatch(
            operationsApi.util.updateQueryData(
              'getStagesByCaseId',
              deletedOperation.caseId,
              (draft) => {
                return draft.filter((stage) => stage.id !== id);
              },
            ),
          );
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStagesByCaseIdQuery: useStages,
  useGetOperationPayloadHistroyQuery: useOperationPayloadHistroy,
  useDeleteOperationMutation: useDeleteOperation,
  useCreteStageMutation: useCreateControlStage,
  useUpdateStageMutation: useUpdateControlStage,
} = operationsApi;
