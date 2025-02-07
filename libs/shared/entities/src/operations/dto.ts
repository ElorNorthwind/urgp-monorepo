import { z } from 'zod';
import {
  ControlOptions,
  controlOptionsValues,
  GET_DEFAULT_CONTROL_DUE_DATE,
} from '../userInput/config';
import { startOfToday } from 'date-fns';
import { operationSlimSchema } from './types';
import {
  numberOrArraySchema,
  operationClassOrArraySchema,
} from '../userInput/dto';

export const createOperationSchema = operationSlimSchema.omit({
  id: true,
  authorId: true,
  updatedById: true,
  approveFromId: true,
  updatedAt: true,
  createdAt: true,
});
export type CreateOperationDto = z.infer<typeof createOperationSchema>;

export const updateOperationSchema = operationSlimSchema
  .omit({
    id: true,
    authorId: true,
    updatedById: true,
    approveFromId: true,
    updatedAt: true,
    createdAt: true,
  })
  .partial()
  .extend({
    id: z.coerce.number().int().positive(),
  });
export type UpdateOperationDto = z.infer<typeof updateOperationSchema>;

export const operationFormSchema = updateOperationSchema
  .omit({ controlFromId: true })
  .required()
  .extend({
    controlFromId: z.coerce.number().int().positive().nullable().optional(),
    controller: z.enum(controlOptionsValues).default(ControlOptions.executor),
  });
export type OperationFormDto = z.infer<typeof operationFormSchema>;

export const markOperationSchema = z.object({
  mode: z.enum(['seen', 'done']).default('seen'),
  class: operationClassOrArraySchema,
  case: numberOrArraySchema,
  operation: numberOrArraySchema,
});
export type MarkOperationDto = z.infer<typeof markOperationSchema>;
