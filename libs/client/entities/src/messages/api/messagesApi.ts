import { rtkApi } from '@urgp/client/shared';
import {
  CreateMessageDto,
  DeleteMessageDto,
  ExtendedMessage,
  Message,
  ReadApartmentMessageDto,
  UpdateMessageDto,
} from '@urgp/shared/entities';

export const messagesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    create: build.mutation<Message, CreateMessageDto>({
      query: (dto) => ({
        url: '/renovation/message',
        method: 'POST',
        body: dto,
      }),
    }),

    readForApartments: build.query<ExtendedMessage[], ReadApartmentMessageDto>({
      query: (dto) => ({
        url: '/renovation/message/apartment',
        method: 'GET',
        params: { ids: dto.apartmentIds },
      }),
    }),

    update: build.mutation<Message, UpdateMessageDto>({
      query: (dto) => ({
        url: `/renovation/message`,
        method: 'PATCH',
        body: dto,
      }),
    }),

    delete: build.mutation<boolean, DeleteMessageDto>({
      query: (dto) => ({
        url: `/renovation/message`,
        method: 'DELETE',
        body: dto,
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateMutation: useCreateMessage,
  useReadForApartmentsQuery: useApartmentMessages,
  useUpdateMutation: useUpdateMessage,
  useDeleteMutation: useDeleteMessage,
} = messagesApi;
