import { rtkApi } from '@urgp/client/shared';
import {
  Case,
  CaseCreateDto,
  CaseUpdateDto,
  UserInputApproveDto,
  UserInputDeleteDto,
} from '@urgp/shared/entities';

export const casesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getCases: build.query<Case[], void>({
      query: () => ({
        url: '/control/case/all',
        method: 'GET',
      }),
    }),
    getCaseById: build.query<Case, number>({
      query: (id) => ({
        url: '/control/case/' + id.toString(),
        method: 'GET',
      }),
    }),
    createCase: build.mutation<Case, CaseCreateDto>({
      query: (dto) => ({
        url: '/control/case',
        method: 'POST',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: createdCase } = await queryFulfilled;
        createdCase?.id &&
          dispatch(
            casesApi.util.updateQueryData('getCases', undefined, (draft) => {
              draft?.unshift(createdCase);
            }),
          );
      },
    }),
    updateCase: build.mutation<Case, CaseUpdateDto>({
      query: (dto) => ({
        url: '/control/case',
        method: 'PATCH',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: updatedCase } = await queryFulfilled;
        updatedCase?.id &&
          dispatch(
            casesApi.util.updateQueryData('getCases', undefined, (draft) => {
              const index = draft.findIndex(
                (stage) => stage.id === updatedCase.id,
              );
              return [
                ...draft.slice(0, index),
                updatedCase,
                ...draft.slice(index + 1),
              ];
            }),
          );
      },
    }),
    deleteCase: build.mutation<Case, UserInputDeleteDto>({
      query: (dto) => ({
        url: '/control/case',
        method: 'DELETE',
        body: dto,
      }),

      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: deletedCase } = await queryFulfilled;
        deletedCase?.id &&
          dispatch(
            casesApi.util.updateQueryData('getCases', undefined, (draft) => {
              return draft.filter((stage) => stage.id !== deletedCase.id);
            }),
          );
      },
    }),

    approveCase: build.mutation<Case, UserInputApproveDto>({
      query: (dto) => ({
        url: '/control/case/approve',
        method: 'PATCH',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled }) {
        const { data: approvedCase } = await queryFulfilled;
        approvedCase?.id &&
          dispatch(
            casesApi.util.updateQueryData('getCases', undefined, (draft) => {
              const index = draft.findIndex(
                (stage) => stage.id === approvedCase.id,
              );
              return [
                ...draft.slice(0, index),
                approvedCase,
                ...draft.slice(index + 1),
              ];
            }),
          );
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCasesQuery: useCases,
  useGetCaseByIdQuery: useCaseById,
  useCreateCaseMutation: useCreateCase,
  useUpdateCaseMutation: useUpdateCase,
  useDeleteCaseMutation: useDeleteCase,
  useApproveCaseMutation: useApproveCase,
} = casesApi;
