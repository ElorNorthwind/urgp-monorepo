import { z } from 'zod';
import {
  classificatorSchema,
  EntityFull,
  entityFullSchema,
  entitySlimSchema,
  externalCaseSchema,
} from '../userInput/types';
import {
  caseActionsValues,
  caseClassesValues,
  viewStatusValues,
} from '../userInput/config';
import { operationFullSchema } from '../operations/types';

const caseSlimFields = {
  class: z.enum(caseClassesValues),
  externalCases: z.array(externalCaseSchema).default([]), // Array of externalCaseSchema objects
  directionIds: z.array(z.number().int().nonnegative()).default([]), // Array of nonnegative integers
  title: z.string().min(1, { message: 'Заголовок не может быть пустым' }),
  notes: z.string().min(1, { message: 'Описание не может быть пустым' }),
};

const caseFullFields = {
  class: z.enum(caseClassesValues),
  externalCases: z.array(externalCaseSchema).default([]), // Array of externalCaseSchema objects
  directions: z.array(classificatorSchema).default([]),
  title: z.string().min(1, { message: 'Заголовок не может быть пустым' }),
  notes: z.string().min(1, { message: 'Описание не может быть пустым' }),
  operationIds: z.array(z.coerce.number().int().nonnegative()).default([]),
  status: classificatorSchema,
  viewStatus: z.enum(viewStatusValues),
  lastEdit: z.string().datetime().nullable(), // ISO 8601 date string
  myReminder: operationFullSchema.nullable(),
  lastStage: operationFullSchema.nullable(),
  dispatches: z.array(operationFullSchema).default([]),
  myPendingStage: operationFullSchema.nullable(),
  actions: z.array(z.enum(caseActionsValues)).default([]),
  escalations: z.coerce.number().int().nonnegative(),
  controlLevel: z.coerce.number().int(),
};

export const caseSlimSchema = entitySlimSchema
  .omit({ title: true, notes: true })
  .extend(caseSlimFields);
export type CaseSlim = z.infer<typeof caseSlimSchema>;

export const caseSchema = entityFullSchema
  .omit({ title: true, notes: true })
  .extend(caseFullFields);

// export type CaseFull = z.infer<typeof caseSchema>;
const caseFullFieldsSchema = z.object(caseFullFields);
export type CaseFull = EntityFull & z.infer<typeof caseFullFieldsSchema>;
