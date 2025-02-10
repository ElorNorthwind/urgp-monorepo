import { z } from 'zod';
import {
  ControlOptions,
  controlOptionsValues,
  OperationClasses,
} from '../userInput/config';
import {
  numberOrArraySchema,
  operationClassOrArraySchema,
} from '../userInput/dto';
import { operationSlimSchema } from './types';

export const createOperationSchema = operationSlimSchema.omit({
  id: true,
  authorId: true,
  updatedById: true,
  approveFromId: true,
  updatedAt: true,
  createdAt: true,
  revision: true,
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
    revision: true,
  })
  .partial()
  .extend({
    id: z.coerce.number().int().nonnegative(),
  });
export type UpdateOperationDto = z.infer<typeof updateOperationSchema>;

export const operationFormSchema = updateOperationSchema
  // .omit({ approveToId: true })
  .required()
  .extend({
    authorId: z.coerce.number().int().nonnegative().nullable().optional(),
    controlFromId: z.coerce
      .number()
      .int()
      .nonnegative()
      .nullable()
      .optional()
      .default(null),
    controlToId: z.coerce
      .number()
      .int()
      .nonnegative()
      .nullable()
      .optional()
      .default(null),
    controller: z.enum(controlOptionsValues).default(ControlOptions.executor),
  });
export type OperationFormDto = z.infer<typeof operationFormSchema>;

export const dispatchFormSchema = operationFormSchema
  .omit({ extra: true, controlToId: true })
  .extend({
    extra: z.string().min(1, { message: 'Укажите причину переноса' }),
    // controlFromId: z.coerce
    //   .number()
    //   .int()
    //   .nonnegative({ message: 'Нужен контролер' }),
    controlToId: z.coerce
      .number()
      .int()
      .nonnegative({ message: 'Нужен исполнитель' }),
  });
export type DispatchFormDto = z.infer<typeof dispatchFormSchema>;

export const markOperationSchema = z.object({
  mode: z.enum(['seen', 'done']).default('seen'),
  class: operationClassOrArraySchema,
  case: numberOrArraySchema,
  operation: numberOrArraySchema,
});
export type MarkOperationDto = z.infer<typeof markOperationSchema>;

export const reminderFormSchema = operationFormSchema
  .extend({
    ...markOperationSchema.shape,
  })
  .omit({ class: true })
  .extend({
    class: z.literal(OperationClasses.reminder).or(operationClassOrArraySchema),
  });
export type ReminderFormDto = z.infer<typeof reminderFormSchema>;
