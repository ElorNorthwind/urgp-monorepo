import { z } from 'zod';

export const getCredentials = z.object({
  system: z.literal('EDO').or(z.literal('RSM')).default('EDO'),
  userId: z.coerce.number().nullable().default(null).optional(),
  orgId: z.coerce.number().nullable().default(0).optional(),
});

export type GetCredentialsDto = z.infer<typeof getCredentials>;
