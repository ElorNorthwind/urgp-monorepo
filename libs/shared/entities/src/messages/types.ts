export type Message = {
  id: number;
  createdAt: Date;
  updatedAt: Date;
  authorId: number;
  apartmentId: number | null;
  buildingId: number | null;
  messageContent: string;
  validUntil: Date | null;
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
  problems: string[];
};
