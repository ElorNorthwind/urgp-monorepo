import { z } from 'zod';
import {
  classificatorInfoSchema,
  classificatorSchema,
  entityFullSchema,
  entitySlimSchema,
  externalCaseSchema,
} from '../userInput/types';

const caseSlimFields = {
  externalCases: z.array(externalCaseSchema).default([]), // Array of externalCaseSchema objects
  directionIds: z.array(z.number().int().positive()).default([]), // Array of positive integers
};

const caseFullFields = {
  externalCases: z.array(externalCaseSchema).default([]), // Array of externalCaseSchema objects
  directionIds: z.array(z.number().int().positive()).default([]), // Array of positive integers
  status: classificatorSchema,
  viewStatus: z.string(),
  lastEdit: z.string().datetime().nullable(), // ISO 8601 date string
  myReminder: z.any().nullable(),
  lastStage: z.any().nullable(),
  dispatches: z.array(z.coerce.number()).default([]),
  myPendingStage: z.any().nullable(),
};

export const caseSlimSchema = entitySlimSchema.extend(caseSlimFields);
export type CaseSlim = z.infer<typeof caseSlimSchema>;

export const caseSchema = entityFullSchema.extend(caseFullFields);
export type CaseFull = z.infer<typeof caseSchema>;
