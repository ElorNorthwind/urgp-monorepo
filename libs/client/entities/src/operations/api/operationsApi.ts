import { rtkApi } from '@urgp/client/shared';
import {
  Case,
  ControlDispatch,
  ControlOperation,
  ControlOperationPayloadHistoryData,
  ControlReminder,
  ControlStage,
  ControlStageCreateDto,
  ControlStageUpdateDto,
  DispatchCreateDto,
  DispatchUpdateDto,
  ReminderCreateDto,
  ReminderUpdateDto,
  UserInputDeleteDto,
} from '@urgp/shared/entities';
import { RefetchCachedCase } from './lib';
import { casesApi } from '../../cases';

export const operationsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getStagesByCaseId: build.query<ControlStage[], number>({
      query: (id) => ({
        url: '/control/operation/stage/by-case/' + id.toString(),
        method: 'GET',
      }),

      // Этот эндпоинт провоцирует статус "отсмотренности"
      // Делаем оптимистичный апдейт операции новой датой просмотра
      async onQueryStarted(id, { dispatch }) {
        dispatch(
          casesApi.util.updateQueryData('getCases', undefined, (draft) => {
            const index = draft.findIndex((stage) => stage.id === id);
            return [
              ...draft.slice(0, index),
              {
                ...draft[index],
                lastSeen: new Date().toISOString(),
                viewStatus:
                  draft[index].viewStatus === 'unwatched'
                    ? 'unwatched'
                    : 'unchanged',
              },
              ...draft.slice(index + 1),
            ] as Case[];
          }),
        );
      },
    }),
    getDispatchesByCaseId: build.query<ControlDispatch[], number>({
      query: (id) => ({
        url: '/control/operation/dispatch/by-case/' + id.toString(),
        method: 'GET',
      }),
    }),
    getRemindersByCaseId: build.query<ControlReminder[], number>({
      query: (id) => ({
        url: '/control/operation/reminder/by-case/' + id.toString(),
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
        RefetchCachedCase(dispatch, createdOperation?.caseId);
      },
    }),

    createDispatch: build.mutation<ControlDispatch, DispatchCreateDto>({
      query: (dto) => ({
        url: '/control/operation/dispatch',
        method: 'POST',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: createdOperation } = await queryFulfilled;
        createdOperation?.caseId &&
          createdOperation?.id &&
          dispatch(
            operationsApi.util.updateQueryData(
              'getDispatchesByCaseId',
              createdOperation.caseId,
              (draft) => {
                return [createdOperation, ...draft];
              },
            ),
          );
        RefetchCachedCase(dispatch, createdOperation?.caseId);
      },
    }),

    createReminder: build.mutation<ControlReminder, ReminderCreateDto>({
      query: (dto) => ({
        url: '/control/operation/reminder',
        method: 'POST',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: createdOperation } = await queryFulfilled;
        createdOperation?.caseId &&
          createdOperation?.id &&
          dispatch(
            operationsApi.util.updateQueryData(
              'getRemindersByCaseId',
              createdOperation.caseId,
              (draft) => {
                return [createdOperation, ...draft];
              },
            ),
          );
        RefetchCachedCase(dispatch, createdOperation?.caseId);
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
        RefetchCachedCase(dispatch, updatedOperation?.caseId);
      },
    }),

    updateDispatch: build.mutation<ControlDispatch, DispatchUpdateDto>({
      query: (dto) => ({
        url: '/control/operation/dispatch',
        method: 'PATCH',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: updatedOperation } = await queryFulfilled;
        updatedOperation?.caseId &&
          updatedOperation?.id &&
          dispatch(
            operationsApi.util.updateQueryData(
              'getDispatchesByCaseId',
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
        RefetchCachedCase(dispatch, updatedOperation?.caseId);
      },
    }),

    updateReminder: build.mutation<ControlReminder, ReminderUpdateDto>({
      query: (dto) => ({
        url: '/control/operation/reminder',
        method: 'PATCH',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: updatedOperation } = await queryFulfilled;
        updatedOperation?.caseId &&
          updatedOperation?.id &&
          dispatch(
            operationsApi.util.updateQueryData(
              'getRemindersByCaseId',
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
        RefetchCachedCase(dispatch, updatedOperation?.caseId);
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
        RefetchCachedCase(dispatch, deletedOperation?.caseId);
      },
    }),

    approveOperation: build.mutation<ControlOperation, UserInputDeleteDto>({
      query: (dto) => ({
        url: '/control/operation/approve',
        method: 'PATCH',
        body: dto,
      }),

      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: approvedOperation } = await queryFulfilled;
        approvedOperation?.caseId &&
          approvedOperation?.id &&
          approvedOperation?.class === 'stage' &&
          dispatch(
            operationsApi.util.updateQueryData(
              'getStagesByCaseId',
              approvedOperation.caseId,
              (draft) => {
                const index = draft.findIndex(
                  (stage) => stage.id === approvedOperation.id,
                );
                return [
                  ...draft.slice(0, index),
                  approvedOperation,
                  ...draft.slice(index + 1),
                ];
              },
            ),
          );
        RefetchCachedCase(dispatch, approvedOperation?.caseId);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetStagesByCaseIdQuery: useStages,
  useGetDispatchesByCaseIdQuery: useDispatches,
  useGetRemindersByCaseIdQuery: useReminders,
  useGetOperationPayloadHistroyQuery: useOperationPayloadHistroy,
  useDeleteOperationMutation: useDeleteOperation,
  useCreteStageMutation: useCreateControlStage,
  useCreateDispatchMutation: useCreateDispatch,
  useCreateReminderMutation: useCreateReminder,
  useUpdateStageMutation: useUpdateControlStage,
  useUpdateDispatchMutation: useUpdateDispatch,
  useUpdateReminderMutation: useUpdateReminder,
  useApproveOperationMutation: useApproveOperation,
} = operationsApi;
