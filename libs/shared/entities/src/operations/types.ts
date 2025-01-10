import { z } from 'zod';
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
  dueDateChanged?: boolean;
} & BasicPayloadDataSlim;

type DispatchPayload = Omit<
  DispatchPayloadSlim,
  | 'typeId'
  | 'approverId'
  | 'approveById'
  | 'updatedById'
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

export type ControlDispatch = BasicOperationData & {
  class: 'dispatch';
  payload: DispatchPayload;
};

export type ControlDispatchPayloadHistoryData = DispatchPayload & {
  class: 'dispatch';
  id: number;
  caseId: number;
};

export type ControlDispatchSlim = BasicOperationDataSlim & {
  class: 'dispatch';
  payload: DispatchPayloadSlim;
};

// ================ НАПОМИНАНИЯ (REMINDERS) ================
type ReminderPayloadSlim = {
  typeId: number;
  observerId: number;
  lastSeenDate: Date;
  expectedDate: Date | null;
  doneDate: Date | null;
  description: string | null;
} & BasicPayloadDataSlim;

type ReminderPayload = Omit<
  ReminderPayloadSlim,
  'typeId' | 'updatedById' | 'observerId' | 'approverId' | 'approveById'
> & {
  type: TypeInfo;
  updatedBy: UserInfo;
  observer: UserInfo | null;
  approver: UserInfo | null;
  approveBy: UserInfo | null;
};

export type ControlReminderSlim = BasicOperationDataSlim & {
  class: 'reminder';
  payload: ReminderPayloadSlim;
};

export type ControlReminder = BasicOperationData & {
  class: 'reminder';
  payload: ReminderPayload;
};

export type ReminderPayloadHistoryData = ReminderPayload & {
  class: 'reminder';
  id: number;
  caseId: number;
};

// ================ КОМПОЗИТНЫЕ ТИПЫ ================
export type ControlOperationSlim =
  | ControlStageSlim
  | ControlDispatchSlim
  | ControlReminderSlim;

export type ControlOperationPayloadHistoryData =
  | ControlStagePayloadHistoryData
  | ControlDispatchPayloadHistoryData
  | ReminderPayloadHistoryData;

export type ControlOperation = ControlStage | ControlDispatch | ControlReminder;

export const controlOperationClass = z
  .literal('stage')
  .or(z.literal('dispatch'))
  .or(z.literal('reminder'))
  .default('stage');

export type ControlOperationClass = z.infer<typeof controlOperationClass>;
