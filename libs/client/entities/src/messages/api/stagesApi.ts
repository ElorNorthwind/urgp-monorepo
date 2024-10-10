import { rtkApi } from '@urgp/client/shared';
import {
  CreateStageDto,
  DeleteMessageDto,
  ExtendedStage,
  ReadApartmentMessageDto,
  Stage,
  UpdateStageDto,
} from '@urgp/shared/entities';

export const stagesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    createStage: build.mutation<Stage, CreateStageDto>({
      query: (dto) => ({
        url: '/renovation/stage',
        method: 'POST',
        body: dto,
      }),
    }),

    readStagesForApartments: build.query<
      ExtendedStage[],
      ReadApartmentMessageDto
    >({
      query: (dto) => ({
        url: '/renovation/stage/apartment',
        method: 'GET',
        params: { ids: dto.apartmentIds },
      }),
    }),

    updateStage: build.mutation<Stage, UpdateStageDto>({
      query: (dto) => ({
        url: `/renovation/stage`,
        method: 'PATCH',
        body: dto,
      }),
    }),

    deleteStage: build.mutation<boolean, DeleteMessageDto>({
      query: (dto) => ({
        url: `/renovation/stage`,
        method: 'DELETE',
        body: dto,
      }),
    }),

    readStageGroups: build.query<string[], void>({
      query: () => ({
        url: '/renovation/stage/groups',
        method: 'GET',
      }),
    }),

    readStageTypes: build.query<
      { id: number; name: string; group: string }[],
      void
    >({
      query: () => ({
        url: '/renovation/stage/types',
        method: 'GET',
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateStageMutation: useCreateStage,
  useReadStagesForApartmentsQuery: useApartmentStages,
  useUpdateStageMutation: useUpdateStage,
  useDeleteStageMutation: useDeleteStage,
  useReadStageGroupsQuery: useStageGroups,
  useReadStageTypesQuery: useStageTypes,
} = stagesApi;
