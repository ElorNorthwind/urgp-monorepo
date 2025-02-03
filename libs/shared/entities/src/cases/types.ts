import { z } from 'zod';
import {
  classificatorSchema,
  entityFullSchema,
  entitySlimSchema,
  externalCaseSchema,
} from '../userInput/types';

const caseSlimFields = {
  externalCases: z.array(externalCaseSchema).default([]), // Array of externalCaseSchema objects
  directionIds: z.array(z.number().int().positive()).default([]), // Array of positive integers
  title: z.string().min(1, { message: 'Заголовок не может быть пустым' }),
  notes: z.string().min(1, { message: 'Описание не может быть пустым' }),
};

const caseFullFields = caseSlimFields && {
  status: classificatorSchema,
  viewStatus: z.string(),
  lastEdit: z.string().datetime().nullable(), // ISO 8601 date string
  myReminder: z.any().nullable(),
  lastStage: z.any().nullable(),
  dispatches: z.array(z.coerce.number()).default([]),
  myPendingStage: z.any().nullable(),
};

export const caseSlimSchema = entitySlimSchema
  .omit({ title: true, notes: true })
  .extend(caseSlimFields);
export type CaseSlim = z.infer<typeof caseSlimSchema>;

export const caseSchema = entityFullSchema
  .omit({ title: true, notes: true })
  .extend(caseFullFields);
export type CaseFull = z.infer<typeof caseSchema>;
