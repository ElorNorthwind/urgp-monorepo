import { BasicPayloadData, TypeInfo, UserInfo } from '../userInput/types';

type BasicOperationData = {
  id: number;
  caseId: number | null;
  createdAt: Date;
  author: UserInfo;
  approver: UserInfo | null;
  version: number;
};

type BasicOperationDataSlim = Omit<BasicOperationData, 'author'> & {
  authorId: number;
};

type StagePayloadSlim = {
  type: number;
  doneDate: Date;
  num: string | null;
  description: string | null;
} & BasicPayloadData;

type StagePayload = Omit<
  StagePayloadSlim,
  'type' | 'approver' | 'approveBy' | 'updatedBy'
> & {
  type: TypeInfo;
  updatedBy: UserInfo;
  approver: UserInfo | null;
  approveBy: UserInfo | null;
};

type DispatchPayloadSlim = {
  type: number;
  updatedAt: Date;
  executorId: number;
  dueDate: Date | null;
  doneDate: Date | null;
  firstSeen: Date | null;
  lastSeen: Date | null;
  description: string | null;
} & BasicPayloadData;

type DispatchPayload = Omit<
  DispatchPayloadSlim,
  'type' | 'approver' | 'approveBy' | 'updatedBy' | 'executorId'
> & {
  type: TypeInfo;
  updatedBy: UserInfo;
  executorId: UserInfo | null;
  approver: UserInfo | null;
  approveBy: UserInfo | null;
};

export type ControlStage = BasicOperationData & {
  class: 'stage';
  payload: StagePayload;
};
export type Dispatch = BasicOperationData & {
  class: 'dispatch';
  payload: DispatchPayload;
};

type ControlStagePayloadHistoryData = StagePayload & {
  class: 'stage';
  id: number;
  caseId: number;
};

type ControlDispatchPayloadHistoryData = DispatchPayload & {
  class: 'dispatch';
  id: number;
  caseId: number;
};

export type ControlOperationPayloadHistoryData =
  | ControlStagePayloadHistoryData
  | ControlDispatchPayloadHistoryData;

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
