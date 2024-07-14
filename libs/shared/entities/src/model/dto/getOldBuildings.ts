import { z } from 'zod';

export const getOldBuldings = z
  .object({
    limit: z.coerce.number().min(1).max(500).default(100),
    page: z.coerce.number().min(1).default(1),
    okrug: z.coerce.string(),
    district: z.coerce.string(),
  })
  .partial();

export type GetOldBuldingsDto = z.infer<typeof getOldBuldings>;
