import { z } from 'zod';

export const messageCreate = z.object({
  authorId: z.coerce.number(),
  buildingId: z.coerce.number().nullable().optional(),
  apartmentId: z.coerce.number().nullable().optional(),
  messageContent: z
    .string()
    .min(1, { message: 'Сообщение не может быть пустым' }),
  validUntil: z.coerce.date().nullable().optional(),
  needsAnswer: z.coerce.boolean().optional().default(false),
  answerDate: z.coerce.date().nullable().optional(),
});

export const messageCreateFormValues = messageCreate.pick({
  messageContent: true,
  validUntil: true,
  needsAnswer: true,
});

export const messageApartmentRead = z.object({
  apartmentIds: z.coerce.number().array().nonempty(),
});

export const messageReabById = z.object({
  id: z.coerce.number(),
});

export const messageUpdate = z.object({
  id: z.coerce.number(),
  messageContent: z.string(),
  validUntil: z.coerce.date().nullable().optional(),
  needsAnswer: z.coerce.boolean().optional().default(false),
  answerDate: z.coerce.date().nullable().optional(),
});

export const messageUpdateFormValues = messageUpdate.pick({
  messageContent: true,
  validUntil: true,
  needsAnswer: true,
});

export const messageDelete = z.object({
  id: z.coerce.number(),
});

export const messagesUnanswered = z.coerce
  .number()
  .or(z.literal('boss'))
  .or(z.literal('all'));

export const messagesPageSearch = z.object({
  tab: z.literal('my').or(z.literal('boss')).or(z.literal('all')).optional(),
  message: z.coerce.number().nullable().optional(),
});

export type CreateMessageDto = z.infer<typeof messageCreate>;
export type ReadApartmentMessageDto = z.infer<typeof messageApartmentRead>;
export type ReadMessageByIdDto = z.infer<typeof messageReabById>;
export type UpdateMessageDto = z.infer<typeof messageUpdate>;
export type DeleteMessageDto = z.infer<typeof messageDelete>;
export type CreateMessageFormValuesDto = z.infer<
  typeof messageCreateFormValues
>;
export type UpdateMessageFormValuesDto = z.infer<
  typeof messageUpdateFormValues
>;
export type MessagesUnansweredDto = z.infer<typeof messagesUnanswered>;
export type MessagesPageSearch = z.infer<typeof messagesPageSearch>;

export const stageCreate = z.object({
  authorId: z.coerce.number(),
  apartmentId: z.coerce.number(),
  messageContent: z.string().nullable(),
  // stageDate: z.coerce.date().nullable().optional(),
  stageId: z.coerce.number(),
  docNumber: z.coerce
    .string()
    .min(1, { message: 'Номер документа обязателен' }),
  docDate: z.coerce.date().default(new Date()),
});

export const stageCreateFormValues = stageCreate.pick({
  messageContent: true,
  stageId: true,
  docNumber: true,
  docDate: true,
});

export const stageUpdate = stageCreate
  .omit({ authorId: true, apartmentId: true })
  .partial()
  .extend({
    id: z.coerce.number(),
    apartmentId: z.coerce.number(),
  });

export type CreateStageDto = z.infer<typeof stageCreate>;
export type UpdateStageDto = z.infer<typeof stageUpdate>;
export type CreateStageFormValuesDto = z.infer<typeof stageCreateFormValues>;
