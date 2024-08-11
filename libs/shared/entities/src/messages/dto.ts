import { z } from 'zod';

export const messageCreate = z.object({
  authorId: z.coerce.number(),
  buildingId: z.coerce.number().nullable().optional(),
  apartmentId: z.coerce.number().nullable().optional(),
  messageContent: z.string(),
  validUntil: z.coerce.date().nullable().optional(),
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
});

export const messageDelete = z.object({
  id: z.coerce.number(),
});

export type CreateMessageDto = z.infer<typeof messageCreate>;
export type ReatApartmentMessageDto = z.infer<typeof messageApartmentRead>;
export type ReadMessageByIdDto = z.infer<typeof messageReabById>;
export type UpdateMessageDto = z.infer<typeof messageUpdate>;
export type DeleteMessageDto = z.infer<typeof messageDelete>;
