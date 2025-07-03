import { z } from 'zod';
import { equityOperationSchema } from './types';

export const createEquityOperationSchema = equityOperationSchema
  .pick({
    objectId: true,
    class: true,
    claimId: true,
    date: true,
    source: true,
    notes: true,
    number: true,
    result: true,
    fio: true,
  })
  .extend({
    typeId: z.coerce
      .number()
      .int()
      .nonnegative({ message: 'Нужен тип операции' }),
    createdById: z.coerce
      .number()
      .int()
      .nonnegative()
      .nullable()
      .optional()
      .default(null),
  });
export type CreateEquityOperationDto = z.infer<
  typeof createEquityOperationSchema
>;

export const updateEquityOperationSchema = equityOperationSchema
  .omit({ class: true })
  .partial()
  .extend({
    id: z.coerce.number().int().nonnegative(),
    class: z.literal('operation').default('operation'),
    updatedById: z.coerce
      .number()
      .int()
      .nonnegative()
      .nullable()
      .optional()
      .default(null),
  });
export type UpdateEquityOperationDto = z.infer<
  typeof updateEquityOperationSchema
>;
