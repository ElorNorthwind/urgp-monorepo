import { z } from 'zod';

const sessionProgressSchema = z.object({
  total: z.coerce.number().int().nonnegative().default(0),
  done: z.coerce.number().int().nonnegative().default(0),
  success: z.coerce.number().int().nonnegative().default(0),
  error: z.coerce.number().int().nonnegative().default(0),
});

export const addressSessionSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  userId: z.coerce.number(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // isError: z.boolean(),
  // isDone: z.boolean(),
  type: z.string().default('fias-search'),
  title: z.string().nullable(),
  notes: z.string().nullable(),
  status: z.string().nullable(),
  queue: z.coerce.number().int().nonnegative().nullable().optional(),
});
export type AddressSession = z.infer<typeof addressSessionSchema>;

export const addressSessionFullSchema = addressSessionSchema.extend(
  sessionProgressSchema.shape,
);
export type AddressSessionFull = z.infer<typeof addressSessionFullSchema>;
