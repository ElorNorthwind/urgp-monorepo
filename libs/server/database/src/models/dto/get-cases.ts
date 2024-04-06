import { z } from 'zod';

export const getCases = z
  .object({
    limit: z.coerce.number().max(500),
    lastPrio: z.coerce.number().min(0).max(3).nullable(),
    lastDate: z.coerce.date().nullable(),
    lastId: z.coerce.number().nullable(),
  })
  .partial();

export type GetCasesDto = z.infer<typeof getCases>;
