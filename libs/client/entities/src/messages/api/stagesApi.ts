import { rtkApi } from '@urgp/client/shared';
import {
  CreateStageDto,
  DeleteMessageDto,
  ExtendedStage,
  MessagesUnansweredDto,
  ReadApartmentMessageDto,
  Stage,
  UnansweredMessage,
  UpdateStageDto,
} from '@urgp/shared/entities';

export const stagesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    create: build.mutation<Stage, CreateStageDto>({
      query: (dto) => ({
        url: '/renovation/stage',
        method: 'POST',
        body: dto,
      }),
    }),

    readForApartments: build.query<ExtendedStage[], ReadApartmentMessageDto>({
      query: (dto) => ({
        url: '/renovation/stage/apartment',
        method: 'GET',
        params: { ids: dto.apartmentIds },
      }),
    }),

    update: build.mutation<Stage, UpdateStageDto>({
      query: (dto) => ({
        url: `/renovation/stage`,
        method: 'PATCH',
        body: dto,
      }),
    }),

    delete: build.mutation<boolean, DeleteMessageDto>({
      query: (dto) => ({
        url: `/renovation/stage`,
        method: 'DELETE',
        body: dto,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateMutation: useCreateStage,
  useReadForApartmentsQuery: useApartmentStages,
  useUpdateMutation: useUpdateStage,
  useDeleteMutation: useDeleteStage,
} = stagesApi;
