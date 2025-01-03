import { BasicPayloadDataSlim, TypeInfo, UserInfo } from '../userInput/types';

// ================ ОБЩАЯ ЧАСТЬ ================

type BasicOperationDataSlim = {
  id: number;
  typeId: number;
  authorId: number;
  caseId: number | null;
  createdAt: Date;
  version: number;
};

type BasicOperationData = Omit<
  BasicOperationDataSlim,
  'authorId' | 'typeId'
> & {
  type: TypeInfo | null;
  author: UserInfo | null;
};

// =============== ЭТАПЫ (STAGES) ================

type StagePayloadSlim = {
  typeId: number;
  doneDate: Date;
  num: string | null;
  description: string | null;
} & BasicPayloadDataSlim;

type StagePayload = Omit<
  StagePayloadSlim,
  'typeId' | 'approverId' | 'approveById' | 'updatedById'
> & {
  type: TypeInfo;
  updatedBy: UserInfo;
  approver: UserInfo;
  approveBy: UserInfo;
};

export type ControlStageSlim = BasicOperationDataSlim & {
  class: 'stage';
  payload: StagePayloadSlim;
};

export type ControlStage = BasicOperationData & {
  class: 'stage';
  payload: StagePayload;
};

export type ControlStagePayloadHistoryData = StagePayload & {
  class: 'stage';
  id: number;
  caseId: number;
};

// =============== ПОРУЧЕНИЯ (DISPATCHES) ================

type DispatchPayloadSlim = {
  typeId: number;
  controllerId: number | null;
  executorId: number;
  dueDate: Date | null;
  description: string | null;
  dateDescription: string | null;
} & BasicPayloadDataSlim;

type DispatchPayload = Omit<
  DispatchPayloadSlim,
  | 'typeId'
  | 'approver'
  | 'approveBy'
  | 'updatedBy'
  | 'controllerId'
  | 'executorId'
> & {
  type: TypeInfo;
  updatedBy: UserInfo;
  controller: UserInfo | null;
  executor: UserInfo | null;
  approver: UserInfo | null;
  approveBy: UserInfo | null;
};

export type Dispatch = BasicOperationData & {
  class: 'dispatch';
  payload: DispatchPayload;
};

export type ControlDispatchPayloadHistoryData = DispatchPayload & {
  class: 'dispatch';
  id: number;
  caseId: number;
};

export type DispatchSlim = BasicOperationDataSlim & {
  class: 'dispatch';
  payload: DispatchPayloadSlim;
};

// ================ СЛЕДИЛКИ ================

// ================ КОМПОЗИТНЫЕ ТИПЫ ================
export type ControlOperationSlim = ControlStageSlim | DispatchSlim;

export type ControlOperationPayloadHistoryData =
  | ControlStagePayloadHistoryData
  | ControlDispatchPayloadHistoryData;

export type ControlOperation = ControlStage | Dispatch;

export type ControlOperationClass = 'stage' | 'dispatch';
