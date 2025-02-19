import { rtkApi, store } from '@urgp/client/shared';
import {
  ApproveControlEntityDto,
  CreateOperationDto,
  DeleteControlEntityDto,
  EntityClasses,
  GET_DEFAULT_CONTROL_DUE_DATE,
  OperationClasses,
  OperationFull,
  OperationSlim,
  UpdateOperationDto,
} from '@urgp/shared/entities';
import { markCachedCase, refetchCachedCase } from '../../cases/api/lib';
import { casesApi } from '../../cases';

export const operationsApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getOperationById: build.query<OperationFull, number>({
      query: (id) => ({
        url: `/control/operation/${id.toString()}/full`,
        method: 'GET',
      }),
      providesTags: ['stage', 'dispatch', 'reminder'],
    }),

    getOperationsByCaseId: build.query<
      OperationFull[],
      { class: OperationClasses | undefined; case: number | number[] }
    >({
      query: (dto) => ({
        url: '/control/operation',
        method: 'GET',
        params: {
          mode: 'full',
          case: dto.case,
          class: dto.class,
        },
      }),
      providesTags: (result, error, arg) => {
        if (
          !arg?.class ||
          !['stage', 'dispatch', 'reminder'].includes(arg.class)
        )
          return ['stage', 'dispatch', 'reminder'];
        return [arg.class];
      },
    }),

    getOperationHistroy: build.query<
      Array<OperationFull & { revisionId: number }>,
      number
    >({
      query: (id) => ({
        url: '/control/operation/' + id.toString() + '/history',
        method: 'GET',
      }),
    }),

    createOperation: build.mutation<OperationFull, CreateOperationDto>({
      query: (dto) => ({
        url: '/control/operation',
        method: 'POST',
        body: dto,
      }),
      invalidatesTags: (_, __, { class: opClass }) => {
        if (!opClass || !['stage', 'dispatch', 'reminder'].includes(opClass))
          return [];
        return [opClass];
      },
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        const { data: createdOperation } = await queryFulfilled;
        refetchCachedCase(createdOperation?.caseId, dispatch, getState);
      },
    }),

    updateOperation: build.mutation<OperationFull, UpdateOperationDto>({
      query: (dto) => ({
        url: '/control/operation',
        method: 'PATCH',
        body: dto,
      }),
      invalidatesTags: (_, __, { class: opClass }) => {
        if (!opClass || !['stage', 'dispatch', 'reminder'].includes(opClass))
          return [];
        return [opClass];
      },
      async onQueryStarted(dto, { dispatch, queryFulfilled, getState }) {
        const { data: updatedOperation } = await queryFulfilled;
        refetchCachedCase(updatedOperation?.caseId, dispatch, getState);
      },
    }),

    markReminders: build.mutation<
      number[],
      { mode: 'seen' | 'done'; case: number[] }
    >({
      query: (dto) => ({
        url: '/control/operation/mark-operation',
        method: 'PATCH',
        body: {
          mode: dto.mode,
          operation: null,
          case: dto.case,
          class: [EntityClasses.reminder],
        },
      }),

      async onQueryStarted(dto, { dispatch, getState }) {
        dto.case.forEach((caseId) => {
          dispatch(
            operationsApi.util.updateQueryData(
              'getOperationsByCaseId',
              { class: EntityClasses.reminder, case: caseId },
              (draft) => {
                return draft.map((op) => {
                  if (
                    dto.case.includes(op.caseId) &&
                    op?.controlFrom?.id === store.getState()?.auth?.user?.id
                  )
                    return {
                      ...op,
                      updatedAt: new Date().toISOString(),
                      doneDate:
                        dto.mode === 'done'
                          ? new Date().toISOString()
                          : op.doneDate,
                    };
                  return op;
                });
              },
            ),
          );
        });
        markCachedCase(dto, dispatch, getState);
      },
    }),

    markReminderAsDone: build.mutation<number[], number>({
      query: (op) => ({
        url: '/control/operation/mark-operation',
        method: 'PATCH',
        body: {
          mode: 'done',
          operation: op,
          class: [EntityClasses.reminder],
        },
      }),

      async onQueryStarted(opId, { dispatch, getState }) {
        const result = await dispatch(
          casesApi.endpoints.getCaseByOperationId.initiate(opId),
        );
        const newCase = result.data;
        newCase &&
          dispatch(
            operationsApi.util.updateQueryData(
              'getOperationsByCaseId',
              { class: EntityClasses.reminder, case: newCase.id },
              (draft) => {
                return draft.map((op) => {
                  if (opId === op.id)
                    return {
                      ...op,
                      updatedAt: new Date().toISOString(),
                      doneDate: new Date().toISOString(),
                    };
                  return op;
                });
              },
            ),
          );
        newCase &&
          markCachedCase(
            { mode: 'done', case: [newCase.id] },
            dispatch,
            getState,
          );
      },
    }),

    markReminderAsWatched: build.mutation<null, number[]>({
      query: (caseIds) => ({
        url: '/control/operation/mark-as-watched',
        method: 'PATCH',
        body: {
          caseIds,
        },
      }),

      async onQueryStarted(caseIds, { dispatch, getState }) {
        caseIds.forEach((caseId) => {
          dispatch(
            operationsApi.util.updateQueryData(
              'getOperationsByCaseId',
              { class: EntityClasses.reminder, case: caseId },
              (draft) => {
                return draft.map((op) => {
                  if (op.controlFrom?.id === store.getState()?.auth?.user?.id)
                    return {
                      ...op,
                      updatedAt: new Date().toISOString(),
                      dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
                      doneDate: null,
                    };
                  return op;
                });
              },
            ),
          );
        });
        markCachedCase({ mode: 'watched', case: caseIds }, dispatch, getState);
      },
    }),

    deleteOperation: build.mutation<OperationSlim, DeleteControlEntityDto>({
      query: (dto) => ({
        url: '/control/operation',
        method: 'DELETE',
        body: dto,
      }),

      async onQueryStarted({ id }, { dispatch, queryFulfilled, getState }) {
        const { data: deletedOperation } = await queryFulfilled;
        dispatch(
          operationsApi.util.updateQueryData(
            'getOperationsByCaseId',
            {
              class: deletedOperation.class,
              case: deletedOperation.caseId,
            },
            (draft) => {
              return draft.filter((stage) => stage.id !== id);
            },
          ),
        );
        refetchCachedCase(deletedOperation?.caseId, dispatch, getState);
      },
    }),

    approveOperation: build.mutation<OperationFull, ApproveControlEntityDto>({
      query: (dto) => ({
        url: '/control/operation/approve',
        method: 'PATCH',
        body: dto,
      }),

      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        const { data: approvedOperation } = await queryFulfilled;

        dispatch(
          operationsApi.util.updateQueryData(
            'getOperationsByCaseId',
            {
              class: approvedOperation.class,
              case: approvedOperation.caseId,
            },
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

        refetchCachedCase(approvedOperation?.caseId, dispatch, getState);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateOperationMutation: useCreateOperation,
  useGetOperationByIdQuery: useOperationById,
  useGetOperationsByCaseIdQuery: useOperations,
  useGetOperationHistroyQuery: useOperationHistory,
  useUpdateOperationMutation: useUpdateOperation,
  useMarkRemindersMutation: useMarkReminders,
  useMarkReminderAsWatchedMutation: useMarkReminderAsWatched,
  useMarkReminderAsDoneMutation: useMarkReminderAsDone,
  useDeleteOperationMutation: useDeleteOperation,
  useApproveOperationMutation: useApproveOperation,
} = operationsApi;
