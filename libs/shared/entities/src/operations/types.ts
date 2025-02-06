import { z } from 'zod';
import {
  entityFullSchema,
  entitySlimSchema,
  userInfoSchema,
} from '../userInput/types';
import { OperationClasses, operationClassesValues } from '../userInput/config';

const operationSlimFields = {
  class: z.enum(operationClassesValues),
  caseId: z.number().int().positive(),
  controlFromId: z.number().int().positive().nullable().default(null),
  controlToId: z.number().int().positive().nullable().default(null),
  dueDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
  doneDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
};

const operationFullFields = {
  class: z.enum(operationClassesValues),
  caseId: z.number().int().positive(),
  controlFrom: userInfoSchema.nullable().default(null),
  controlTo: userInfoSchema.nullable().default(null),
  dueDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
  doneDate: z.string().datetime().nullable().default(null), // ISO 8601 date string
};

export const operationSlimSchema = entitySlimSchema.extend(operationSlimFields);
export type OperationSlim = z.infer<typeof operationSlimSchema>;

export const operationFullSchema = entityFullSchema.extend(operationFullFields);
export type OperationFull = z.infer<typeof operationFullSchema>;
