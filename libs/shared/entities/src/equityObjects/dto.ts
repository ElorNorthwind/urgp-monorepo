import { z } from 'zod';

export const getEquityObjectById = z.object({
  id: z.coerce.number(),
});

export type GetEquityObjectDto = z.infer<typeof getEquityObjectById>;
