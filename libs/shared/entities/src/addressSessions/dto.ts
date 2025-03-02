import { z } from 'zod';
import { addressSessionSchema } from './types';

export const createAddressSessionSchema = addressSessionSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    isError: true,
    isDone: true,
  })
  .partial();
export type CreateAddressSessionDto = z.infer<
  typeof createAddressSessionSchema
>;

export const updateAddressSessionSchema = addressSessionSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
  })
  .partial()
  .extend({
    id: z.coerce.number().int().nonnegative(),
  });

export type UpdateAddressSessionDto = z.infer<
  typeof updateAddressSessionSchema
>;
