import { z } from 'zod';

export type Message = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  apartmentId: number | null;
  buildingId: number | null;
  messageContent: string;
  needsAnswer: boolean;
  answerDate: Date | null;
};

export type ExtendedMessage = Message & {
  authorFio: string;
  isBoss: boolean;
};

export type UnansweredMessage = Pick<
  Message,
  | 'id'
  | 'createdAt'
  | 'updatedAt'
  | 'authorId'
  | 'apartmentId'
  | 'buildingId'
  | 'messageContent'
> & {
  messageType: string | null;
  author: string;
  roles: string[];

  lastMessageId: number | null;
  lastMessageContent: string | null;
  lastMessateType: string | null;
  lastMessageCreatedAt: Date | null;
  lastMessageAuthor: string | null;

  adress: string;
  okrug: string;
  district: string;
  apartNum: string;
  fio: string;
  apartType: string;
  kpuNum: string;
  apartStatus: string;
  stage: string;
  actionText: string;
  deviation: string;
  problems: string;
};

export type StageApproveStatusData = {
  approveStatus: 'pending' | 'approved' | 'rejected';
  approveDate: Date | null;
  approveBy: number | null;
  approveNotes: string | null;
};

export type Stage = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  editedAt: Date | null;
  authorId: number;
  editedBy: number | null;
  apartmentId: number | null;
  messageContent: string;
  stageId: number;
  docNumber: string;
  docDate: Date;
} & StageApproveStatusData;

export type ExtendedStage = Stage & {
  stageName: string;
  authorFio: string;
  group: string;
  action: string;
  priority: number;
};

export type StageGroup = {
  label: string;
  value: string;
  items: Array<{ value: number; label: string; action?: string }>;
};

export type PendingStage = Pick<
  ExtendedStage,
  'id' | 'apartmentId' | 'createdAt' | 'authorId' | 'authorFio'
> & {
  pendingDocDate: Date;
  pendingDocNum: string;
  pendingDocNotes: string | null;
  pendingStageId: number;
  pendingStageName: string;
  pendingAction: string | null;
  buildingId: number | null;
  adress: string;
  okrug: string;
  district: string;
  apartNum: string;
  apartType: string;
  fio: string;
  kpuNum: string;
  apartStatus: string;
  stage: string;
  action: string;
  deviation: string;
  problems: string;
};

export type MessageServer = {
  id: number;
  affair_id: number;
  created_at: Date | string;
  updated_at: Date | string;
  author_uuid?: string;
  author_fio: string;
  message_content: string;
  is_deleted: boolean;
};

export const messageServerCreateSchema = z.object({
  author_uuid: z.string().uuid({ message: 'Некорректный UUID пользователя' }),
  affair_id: z
    .number()
    .int()
    .nonnegative({ message: 'Некорректное Affair ID' }),
  message_text: z
    .string()
    .min(1, { message: 'Сообщение не может быть пустым' }),
});
export type MessageServerCreateDto = z.infer<typeof messageServerCreateSchema>;

export const messageServerUpdateSchema = z.object({
  message_id: z
    .number()
    .int()
    .nonnegative({ message: 'Некорректное ID сообщения' }),
  message_text: z
    .string()
    .min(1, { message: 'Сообщение не может быть пустым' }),
});
export type MessageServerUpdateDto = z.infer<typeof messageServerUpdateSchema>;
