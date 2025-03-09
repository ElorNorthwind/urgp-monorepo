import { z } from 'zod';

const sessionProgressSchema = z.object({
  total: z.coerce.number().int().nonnegative().default(0),
  done: z.coerce.number().int().nonnegative().default(0),
  good: z.coerce.number().int().nonnegative().default(0),
  questionable: z.coerce.number().int().nonnegative().default(0),
  pending: z.coerce.number().int().nonnegative().default(0),
  error: z.coerce.number().int().nonnegative().default(0),
});

export const addressSessionSchema = z.object({
  id: z.coerce.number().int().nonnegative(),
  userId: z.coerce.number(),
  userFio: z.string(),
  createdAt: z.string().datetime(),
  updatedAt: z.string().datetime(),
  // isError: z.boolean(),
  // isDone: z.boolean(),
  type: z.string().default('fias-search'),
  title: z.string().nullable(),
  notes: z.string().nullable(),
  status: z.string().nullable(),
  queue: z.coerce.number().int().nonnegative().nullable().optional(),
  class: z.literal('session'),
});
export type AddressSession = z.infer<typeof addressSessionSchema>;

export const addressSessionFullSchema = addressSessionSchema.extend(
  sessionProgressSchema.shape,
);
export type AddressSessionFull = z.infer<typeof addressSessionFullSchema>;

export type RatesDailyUsage = {
  fias: number;
  dadata: number;
  fiasCount: number;
  dadataCount: number;
};
