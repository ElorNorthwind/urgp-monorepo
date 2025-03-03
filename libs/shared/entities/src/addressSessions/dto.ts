import { z } from 'zod';
import { addressSessionSchema } from './types';

export const createAddressSessionSchema = addressSessionSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    status: true,
  })
  .partial()
  .extend({
    addresses: z.array(z.string()).optional(),
  });
export type CreateAddressSessionDto = z.infer<
  typeof createAddressSessionSchema
>;

export const updateAddressSessionSchema = addressSessionSchema
  .omit({
    id: true,
    userId: true,
    createdAt: true,
    updatedAt: true,
    status: true,
  })
  .partial()
  .extend({
    id: z.coerce.number().int().nonnegative(),
  });

export type UpdateAddressSessionDto = z.infer<
  typeof updateAddressSessionSchema
>;

export const addressUploadPageSearchSchema = z.object({
  sessionId: z.coerce.number().int().nonnegative().optional(),
});

export type AddressUploadPageSearchDto = z.infer<
  typeof addressUploadPageSearchSchema
>;
