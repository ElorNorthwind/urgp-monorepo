import { BasicPayloadData, TypeInfo } from '../userInput/types';

type BasicOperationData = {
  id: number;
  caseId: number | null;
  problemId: number | null;
  createdAt: Date;
  authorId: number;
};

type StagePayload = {
  // externalCase: ExternalCase | null; // внешний номер
  type: TypeInfo;
  doneDate: Date;
  num: string | null;
  description: string | null; // описание этапа
} & BasicPayloadData;

type DispatchPayload = {
  updatedAt: Date;
  isDeleted: boolean;
  executorId: number;
  type: TypeInfo;
  dueDate: Date | null;
  doneDate: Date | null;
  firstSeen: Date | null;
  lastSeen: Date | null;
  description: string | null;
};

export type Stage = BasicOperationData & {
  class: 'stage';
  payload: StagePayload;
};
export type Dispatch = BasicOperationData & {
  class: 'dispatch';
  payload: DispatchPayload;
};

export type Operation = Stage | Dispatch;
