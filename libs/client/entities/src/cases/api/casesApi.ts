import { rtkApi } from '@urgp/client/shared';
import {
  Case,
  CaseCreateDto,
  CaseUpdateDto,
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
    createCase: build.mutation<Case, CaseCreateDto>({
      query: (dto) => ({
        url: '/control/case',
        method: 'POST',
        body: dto,
      }),
    }),
    updateCase: build.mutation<Case, CaseUpdateDto>({
      query: (dto) => ({
        url: '/control/case',
        method: 'PATCH',
        body: dto,
      }),
    }),
    deleteCase: build.mutation<Case, UserInputDeleteDto>({
      query: (dto) => ({
        url: '/control/case',
        method: 'DELETE',
        body: dto,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useGetCasesQuery: useCases,
  useCreateCaseMutation: useCreateCase,
  useUpdateCaseMutation: useUpdateCase,
  useDeleteCaseMutation: useDeleteCase,
} = casesApi;
