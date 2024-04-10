import { nullable, z } from 'zod';

export const getCredentials = z
  .object({
    system: z.literal('EDO').or(z.literal('RSM')),
    userId: z.coerce.number().nullable(),
    orgId: z.coerce.number().nullable(),
  })
  .partial();

export type GetCredentialsDto = z.infer<typeof getCredentials>;
