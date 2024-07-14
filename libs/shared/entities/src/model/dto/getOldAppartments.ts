import { z } from 'zod';
import { getOldBuldings } from './getOldBuildings';

export const getOldAppartments = getOldBuldings
  .extend({
    buildingId: z.coerce.number(),
  })
  .partial();

export type GetOldAppartmentsDto = z.infer<typeof getOldAppartments>;
