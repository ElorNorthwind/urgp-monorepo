import { rtkApi } from '@urgp/client/shared';
import {
  CreateMessageDto,
  DeleteMessageDto,
  ExtendedMessage,
  Message,
  MessagesUnansweredDto,
  ReadApartmentMessageDto,
  UnansweredMessage,
  UpdateMessageDto,
} from '@urgp/shared/entities';

export const messagesApi = rtkApi.injectEndpoints({
  endpoints: (build) => ({
    createMessage: build.mutation<Message, CreateMessageDto>({
      query: (dto) => ({
        url: '/renovation/message',
        method: 'POST',
        body: dto,
      }),
    }),

    readMessagesForApartments: build.query<
      ExtendedMessage[],
      ReadApartmentMessageDto
    >({
      query: (dto) => ({
        url: '/renovation/message/apartment',
        method: 'GET',
        params: { ids: dto.apartmentIds },
      }),
    }),

    updateMessage: build.mutation<Message, UpdateMessageDto>({
      query: (dto) => ({
        url: `/renovation/message`,
        method: 'PATCH',
        body: dto,
      }),
    }),

    deleteMessage: build.mutation<boolean, DeleteMessageDto>({
      query: (dto) => ({
        url: `/renovation/message`,
        method: 'DELETE',
        body: dto,
      }),
    }),

    readUnasweredMessages: build.query<
      UnansweredMessage[],
      MessagesUnansweredDto
    >({
      query: (user) => ({
        url: '/renovation/unanswered-messages/' + user,
        method: 'GET',
      }),
    }),
  }),
  overrideExisting: false,
});

export const {
  useCreateMessageMutation: useCreateMessage,
  useReadMessagesForApartmentsQuery: useApartmentMessages,
  useUpdateMessageMutation: useUpdateMessage,
  useDeleteMessageMutation: useDeleteMessage,
  useReadUnasweredMessagesQuery: useUnansweredMessages,
} = messagesApi;
