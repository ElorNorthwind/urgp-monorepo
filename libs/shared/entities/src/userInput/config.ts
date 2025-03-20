import { addBusinessDays, formatISO, startOfToday } from 'date-fns';
import { unknown, z } from 'zod';

export const GET_DEFAULT_CONTROL_DUE_DATE = () =>
  addBusinessDays(startOfToday(), 5).toISOString();

// Хелпер функция для выборки ключей в виде массива
function getValues<T extends Record<string, any>>(obj: T) {
  return Object.values(obj) as [(typeof obj)[keyof T]];
}

export const CaseClasses = {
  incident: 'control-incident',
  problem: 'control-problem',
} as const;
export type CaseClasses = (typeof CaseClasses)[keyof typeof CaseClasses];
export const caseClassesValues = getValues(CaseClasses);

export const OperationClasses = {
  stage: 'stage',
  reminder: 'reminder',
  dispatch: 'dispatch',
} as const;
export type OperationClasses =
  (typeof OperationClasses)[keyof typeof OperationClasses];
export const operationClassesValues = getValues(OperationClasses);

export const EntityClasses = { ...CaseClasses, ...OperationClasses } as const;
export type EntityClasses = (typeof EntityClasses)[keyof typeof EntityClasses];
export const entityClassesValues = getValues(EntityClasses);

export const ViewStatus = {
  unwatched: 'unwatched',
  unchanged: 'unchanged',
  new: 'new',
  changed: 'changed',
} as const;
export type ViewStatus = (typeof ViewStatus)[keyof typeof ViewStatus];
export const viewStatusValues = getValues(ViewStatus);

export const CaseActions = {
  unknown: 'unknown',
  caseApprove: 'case-approve',
  operationApprove: 'operation-approve',
  caseRejected: 'case-rejected',
  caseProject: 'case-project',
  reminderDone: 'reminder-done',
  reminderOverdue: 'reminder-overdue',
  escalation: 'escalation',
  controlToMe: 'control-to-me',
} as const;
export type CaseActions = (typeof CaseActions)[keyof typeof CaseActions];
export const caseActionsValues = getValues(CaseActions);

export const ApproveStatus = {
  project: 'project',
  pending: 'pending',
  approved: 'approved',
  rejected: 'rejected',
} as const;
export type ApproveStatus = (typeof ApproveStatus)[keyof typeof ApproveStatus];
export const approveStatusValues = getValues(ApproveStatus);

export const ControlOptions = {
  author: 'author',
  executor: 'executor',
} as const;
export type ControlOptions =
  (typeof ControlOptions)[keyof typeof ControlOptions];
export const controlOptionsValues = getValues(ControlOptions);

export const DialogFormState = {
  create: 'create',
  edit: 'edit',
  close: 'close',
} as const;
export type DialogFormState =
  (typeof DialogFormState)[keyof typeof DialogFormState];

export const ApproveFormState = {
  operation: 'operation',
  case: 'case',
  close: 'close',
} as const;
export type ApproveFormState =
  (typeof ApproveFormState)[keyof typeof ApproveFormState];

export const EscalateFormState = {
  open: 'open',
  close: 'close',
} as const;
export type EscalateFormState =
  (typeof EscalateFormState)[keyof typeof EscalateFormState];

export const approveFormSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  approveToId: z.coerce.number().int().nonnegative().nullable(),
  approveNotes: z.string(),
  dueDate: z.string().datetime({ message: 'Формат даты' }),
});
export type ApproveFormDto = z.infer<typeof approveFormSchema>;

export const emptyApproveData = {
  id: 0,
  approveToId: 0,
  approveNotes: '',
  dueDate: GET_DEFAULT_CONTROL_DUE_DATE(),
};

export const ControlToMeStatus = {
  deligated: 'deligated',
  direct: 'direct',
  none: 'none',
} as const;
export type ControlToMeStatus =
  (typeof ControlToMeStatus)[keyof typeof ControlToMeStatus];
