import { z } from 'zod';

export const addressResultCreate = z.object({
  addressId: z.coerce.number(),
  result: z.coerce.number().min(1),
});
