import { rtkApi } from '@urgp/client/shared';
import {
  ApproveControlEntityDto,
  CreateOperationDto,
  DeleteControlEntityDto,
  EntityClasses,
  OperationClasses,
  OperationFull,
  UpdateOperationDto,
} from '@urgp/shared/entities';
import { markCachedCase, refetchCachedCase } from '../../cases/api/lib';

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
        search: {
          mode: 'full',
          case: dto.case,
          class: dto.class,
        },
      }),
      providesTags: (_, __, dto) => {
        if (
          !dto?.class ||
          !['stage', 'dispatch', 'reminder'].includes(dto.class)
        )
          return [];
        return [dto.class];
      },
      // providesTags: ['stage', 'dispatch', 'reminder'],
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
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
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
        dispatch(
          operationsApi.util.updateQueryData(
            'getOperationsByCaseId',
            { class: EntityClasses.reminder, case: dto.case },
            (draft) => {
              return draft.map((op) => {
                if (dto.case.includes(op.caseId))
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

        markCachedCase(dto, dispatch, getState);
      },
    }),

    deleteOperation: build.mutation<OperationFull, DeleteControlEntityDto>({
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
              case: deletedOperation.id,
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
              case: approvedOperation.id,
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
  useDeleteOperationMutation: useDeleteOperation,
  useApproveOperationMutation: useApproveOperation,
} = operationsApi;
