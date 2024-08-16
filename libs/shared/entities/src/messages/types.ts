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
  fio: string;
  roles: string[];
  adress: string;
  apartNum: string;
  apartType: string;
  kpuNum: string;
  stage: string;
  actionText: string;
  deviation: string;
  problems: string[];
};
