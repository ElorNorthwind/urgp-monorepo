import { z } from 'zod';

export const addressSessionSchema = z.object({
  id: z.coerce.number(),
  userId: z.coerce.number(),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  isError: z.boolean(),
  isDone: z.boolean(),
  type: z.string().default('fias-search'),
  title: z.string().nullable(),
  notes: z.string().nullable(),
});
export type AddressSession = z.infer<typeof addressSessionSchema>;
