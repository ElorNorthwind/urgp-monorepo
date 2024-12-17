import { rtkApi } from '@urgp/client/shared';
import {
  approveStage,
  ApproveStageDto,
  CreateStageDto,
  DeleteMessageDto,
  ExtendedStage,
  PendingStage,
  ReadApartmentMessageDto,
  Stage,
  StageGroup,
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

    updateRenovationStage: build.mutation<Stage, UpdateStageDto>({
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

    readStageGroups: build.query<StageGroup[], void>({
      query: () => ({
        url: '/renovation/stage/groups',
        method: 'GET',
      }),
    }),

    approveStage: build.mutation<Stage, ApproveStageDto>({
      query: (dto) => ({
        url: '/renovation/stage/approve',
        method: 'PATCH',
        body: dto,
      }),
    }),

    readPendingStages: build.query<PendingStage[], void>({
      query: () => ({
        url: '/renovation/stage/pending',
        method: 'GET',
      }),
    }),
  }),

  overrideExisting: false,
});

export const {
  useCreateStageMutation: useCreateStage,
  useReadStagesForApartmentsQuery: useApartmentStages,
  useUpdateRenovationStageMutation: useUpdateStage,
  useDeleteStageMutation: useDeleteStage,
  useReadStageGroupsQuery: useStageGroups,
  useApproveStageMutation: useApproveStage,
  useReadPendingStagesQuery: usePendingStages,
} = stagesApi;
