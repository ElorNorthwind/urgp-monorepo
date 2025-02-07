import { rtkApi } from '@urgp/client/shared';
import {
  ApproveControlEntityDto,
  CaseFull,
  CreateCaseDto,
  DeleteControlEntityDto,
  ReadEntityDto,
  UpdateCaseDto,
} from '@urgp/shared/entities';
import { deleteCachedCase, insertCachedCase, updateCachedCase } from './lib';

export const casesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    getCases: build.query<CaseFull[], ReadEntityDto['visibility'] | undefined>({
      query: (visibility) => ({
        url: '/control/case',
        method: 'GET',
        params: {
          mode: 'full',
          class: 'control-incident',
          visibility: visibility ?? 'visible',
        },
      }),
      providesTags: ['control-incident'],
    }),

    getCaseById: build.query<CaseFull, number>({
      query: (id) => ({
        url: `/control/case/${id.toString()}/full`,
        method: 'GET',
      }),
      providesTags: ['control-incident'],
    }),

    getCaseByOperationId: build.query<CaseFull, number>({
      query: (id) => ({
        url: `/control/case/${id.toString()}/by-operation`,
        method: 'GET',
      }),
      providesTags: ['control-incident'],
    }),

    createCase: build.mutation<CaseFull, CreateCaseDto>({
      query: (dto) => ({
        url: '/control/case',
        method: 'POST',
        body: dto,
      }),

      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        const { data: newCase } = await queryFulfilled;
        insertCachedCase(newCase, dispatch, getState);
      },
    }),

    updateCase: build.mutation<CaseFull, UpdateCaseDto>({
      query: (dto) => ({
        url: '/control/case',
        method: 'PATCH',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        const { data: newCase } = await queryFulfilled;
        updateCachedCase(newCase, dispatch, getState);
      },
    }),

    deleteCase: build.mutation<CaseFull, DeleteControlEntityDto>({
      query: (dto) => ({
        url: '/control/case',
        method: 'DELETE',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        const { data: newCase } = await queryFulfilled;
        deleteCachedCase(newCase, dispatch, getState);
      },
    }),

    approveCase: build.mutation<CaseFull, ApproveControlEntityDto>({
      query: (dto) => ({
        url: '/control/case/approve',
        method: 'PATCH',
        body: dto,
      }),
      async onQueryStarted({}, { dispatch, queryFulfilled, getState }) {
        const { data: newCase } = await queryFulfilled;
        updateCachedCase(newCase, dispatch, getState);
      },
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCasesQuery: useCases,
  useGetCaseByIdQuery: useCaseById,
  useGetCaseByOperationIdQuery: useCaseByOperationId,
  useCreateCaseMutation: useCreateCase,
  useUpdateCaseMutation: useUpdateCase,
  useDeleteCaseMutation: useDeleteCase,
  useApproveCaseMutation: useApproveCase,
} = casesApi;
