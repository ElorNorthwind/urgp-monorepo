import { BasicPayloadData, TypeInfo, UserInfo } from '../userInput/types';

type BasicOperationData = {
  id: number;
  caseId: number | null;
  createdAt: Date;
  author: UserInfo;
  approver: UserInfo | null;
};

type BasicOperationDataSlim = Omit<BasicOperationData, 'author'> & {
  authorId: number;
};

type StagePayload = {
  // externalCase: ExternalCase | null; // внешний номер
  type: TypeInfo;
  doneDate: Date;
  num: string | null;
  description: string | null; // описание этапа
} & BasicPayloadData;

type StagePayloadSlim = Omit<StagePayload, 'type'> & {
  type: number;
};

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

type DispatchPayloadSlim = Omit<DispatchPayload, 'type'> & {
  type: number;
};

export type ControlStage = BasicOperationData & {
  class: 'stage';
  payload: StagePayload;
};
export type Dispatch = BasicOperationData & {
  class: 'dispatch';
  payload: DispatchPayload;
};

export type ControlOperation = ControlStage | Dispatch;

export type ControlStageSlim = BasicOperationDataSlim & {
  class: 'stage';
  payload: StagePayloadSlim;
};

export type DispatchSlim = BasicOperationDataSlim & {
  class: 'dispatch';
  payload: DispatchPayloadSlim;
};

export type ControlOperationSlim = ControlStageSlim | DispatchSlim;

export type ControlOperationClass = 'stage' | 'dispatch';
