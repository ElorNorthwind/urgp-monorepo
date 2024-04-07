import { z } from 'zod';

export const getStreets = z.object({
  query: z.coerce.string().optional(),
  limit: z.coerce.number().optional(),
});

export type GetStreetsDto = z.infer<typeof getStreets>;
