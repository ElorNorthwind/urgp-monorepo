import { formatISO, startOfToday } from 'date-fns';
import {
  ApproveStatus,
  ControlOptions,
  GET_DEFAULT_CONTROL_DUE_DATE,
  OperationClasses,
} from '../userInput/config';
import { OperationFormDto } from './dto';

const emptyOp = {
  id: 0,
  caseId: 0,
  class: OperationClasses.stage,
  typeId: 6,
  controlFromId: null,
  controlToId: null,
  approveToId: null,
  approveStatus: ApproveStatus.project,
  approveDate: null,
  approveNotes: null,
  dueDate: null,
  doneDate: null,
  title: '',
  notes: '',
  extra: '',
  controller: ControlOptions.executor,
} as OperationFormDto;

export const emptyStage = {
  ...emptyOp,

  class: OperationClasses.stage,
  typeId: 6,
  doneDate: startOfToday().toISOString(),
} as OperationFormDto;

export const emptyDispatch = {
  ...emptyOp,

  class: OperationClasses.dispatch,
  typeId: 10,
  dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
  extra: 'Первично установленный срок',
} as OperationFormDto;

export const emptyReminder = {
  ...emptyOp,

  class: OperationClasses.reminder,
  typeId: 11,
  dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
} as OperationFormDto;

// + Server side values:
// authorId: 1,
// updatedById: 1,
// approveFromId: 1,
// createdAt: '2024-12-04T08:26:56.000Z',
// updatedAt: '2025-01-17T16:17:11.198Z',
