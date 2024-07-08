import { z } from 'zod';

export const getRenovationOldHouses = z
  .object({
    limit: z.coerce.number().max(500).default(100),
    page: z.coerce.number().min(1).default(1),
    okrug: z.coerce.string().optional(),
    district: z.coerce.string().optional(),
  })
  .partial();

export type GetRenovationOldHousesDto = z.infer<typeof getRenovationOldHouses>;
