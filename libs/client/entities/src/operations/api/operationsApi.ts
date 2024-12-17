import { rtkApi } from '@urgp/client/shared';
import {
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

    creteStage: build.mutation<ControlStageSlim, ControlStageCreateDto>({
      query: (dto) => ({
        url: '/control/operation/stage',
        method: 'POST',
        body: dto,
      }),

      // добавить писимистичный апдейт основного запроса
      // async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
      //   const { data: deletedOperation } = await queryFulfilled;
      //   deletedOperation?.caseId &&
      //     dispatch(
      //       operationsApi.util.updateQueryData(
      //         'getStagesByCaseId',
      //         deletedOperation.caseId,
      //         (draft) => {
      //           return draft.filter((stage) => stage.id !== id);
      //         },
      //       ),
      //     );
      // },
    }),

    updateStage: build.mutation<ControlStageSlim, ControlStageUpdateDto>({
      query: (dto) => ({
        url: '/control/operation/stage',
        method: 'PATCH',
        body: dto,
      }),

      // добавить писимистичный апдейт основного запроса
      // async onQueryStarted({ id }, { dispatch, queryFulfilled }) {
      //   const { data: deletedOperation } = await queryFulfilled;
      //   deletedOperation?.caseId &&
      //     dispatch(
      //       operationsApi.util.updateQueryData(
      //         'getStagesByCaseId',
      //         deletedOperation.caseId,
      //         (draft) => {
      //           return draft.filter((stage) => stage.id !== id);
      //         },
      //       ),
      //     );
      // },
    }),

    deleteOperation: build.mutation<ControlStageSlim, UserInputDeleteDto>({
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

// {
//   "id": 1,
//   "class": "stage",
//   "author": {
//       "id": 1,
//       "fio": "Шепелев С.А."
//   },
//   "createdAt": "2024-12-10T14:29:29.000Z",
//   "payload": {
//       "num": "согл-111222333-1",
//       "type": {
//           "id": 1,
//           "name": "запрос",
//           "category": "рассмотрение",
//           "fullname": "Направлен запрос",
//           "priority": 1
//       },
//       "approver": 1,
//       "doneDate": "2024-01-02T03:00:00.000+03:00",
//       "approveBy": 1,
//       "isDeleted": false,
//       "updatedAt": "2024-12-12T13:28:06.788575+03:00",
//       "updatedBy": 1,
//       "approveDate": "2024-12-12T13:27:40.661058+03:00",
//       "description": "Тестовая операция изменена",
//       "approveNotes": "пу пу пу",
//       "approveStatus": "pending"
//   }
// }

export const {
  useGetStagesByCaseIdQuery: useStages,
  useDeleteOperationMutation: useDeleteOperation,
  useCreteStageMutation: useCreateControlStage,
  useUpdateStageMutation: useUpdateControlStage,
} = operationsApi;
