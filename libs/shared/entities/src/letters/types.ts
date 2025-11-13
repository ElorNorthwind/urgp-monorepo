import { z } from 'zod';

export type UnchangedResolution = {
  id: number;
  caseNum: string;
  caseDate: string | Date;
  dueDate: string | Date;
  notes: string | null;
  expert: string;
  markedAt: string | Date;
  notifiedAt: string | Date | null;
  edoId: number;
};

export const telegramMessageRecordSchema = z.object({
  id: z.number(),
  chatId: z.number().nullable(),
  messageId: z.number().nullable(),
  caseId: z.number().nullable(),
  createdAt: z.string().datetime(),
  messageType: z.string().nullable(),
  replyUserId: z.number().nullable(),
  replyUserName: z.string().nullable(),
  replyDate: z.string().datetime().nullable(),
});
export type TelegramMessageRecord = z.infer<typeof telegramMessageRecordSchema>;
export type TelegramMessageRecordUpsert = Partial<TelegramMessageRecord>;
