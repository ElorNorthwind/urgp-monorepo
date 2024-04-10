import { z } from 'zod';

export const getCredentials = z.object({
  system: z.literal('EDO').or(z.literal('RSM')).default('EDO'),
  userId: z.coerce.number().nullable().optional().default(null),
  orgId: z.coerce.number().optional().default(0),
});

export type GetCredentialsDto = z.infer<typeof getCredentials>;
