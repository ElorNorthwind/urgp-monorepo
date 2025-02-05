import { addBusinessDays, startOfToday } from 'date-fns';

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
